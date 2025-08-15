import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Profile } from '../users/entities/profile.entity';
import { OAuthLoginDto } from './dto/oauth-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async oauthLogin(oauthData: OAuthLoginDto) {
    let user = await this.userRepository.findOne({
      where: [
        { email: oauthData.email },
        { oauth_provider: oauthData.oauth_provider, oauth_id: oauthData.oauth_id },
      ],
      relations: ['profile'],
    });

    if (!user) {
      // Create new user
      user = this.userRepository.create({
        email: oauthData.email,
        name: oauthData.name,
        oauth_provider: oauthData.oauth_provider,
        oauth_id: oauthData.oauth_id,
      });
      user = await this.userRepository.save(user);

      // Create empty profile
      const profile = this.profileRepository.create({
        user_id: user.id,
      });
      await this.profileRepository.save(profile);
      user.profile = profile;
    } else {
      // Update OAuth info if missing
      if (!user.oauth_provider || !user.oauth_id) {
        user.oauth_provider = oauthData.oauth_provider;
        user.oauth_id = oauthData.oauth_id;
        await this.userRepository.save(user);
      }
    }

    const tokens = await this.generateTokens(user);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.validateUser(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('JWT_EXPIRATION', '7d'),
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 3600, // 1 hour in seconds
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      profile: user.profile,
    };
  }
}
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserPreferencesDto, CreateUserPreferencesDto } from './dto/user-preferences.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['profile'],
    });
  }

  async getUserProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'profile',
        'employment_history',
        'education',
        'user_skills',
        'awards',
        'certificates',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const user = await this.findById(userId);
    
    let profile = user.profile;
    
    if (!profile) {
      // Create new profile if doesn't exist
      profile = this.profileRepository.create({
        ...updateProfileDto,
        user_id: userId,
      });
    } else {
      // Update existing profile
      Object.assign(profile, updateProfileDto);
    }

    return await this.profileRepository.save(profile);
  }

  async getPreferences(userId: string): Promise<CreateUserPreferencesDto> {
    const user = await this.findById(userId);
    const defaultPreferences: CreateUserPreferencesDto = {
      email_notifications: true,
      marketing_emails: false,
      language: 'en',
      timezone: 'UTC',
    };
    
    if (!user.preferences) {
      return defaultPreferences;
    }
    
    return {
      email_notifications: user.preferences.email_notifications ?? defaultPreferences.email_notifications,
      marketing_emails: user.preferences.marketing_emails ?? defaultPreferences.marketing_emails,
      language: user.preferences.language ?? defaultPreferences.language,
      timezone: user.preferences.timezone ?? defaultPreferences.timezone,
      custom_settings: user.preferences.custom_settings,
    };
  }

  async updatePreferences(
    userId: string,
    updatePreferencesDto: UpdateUserPreferencesDto,
  ): Promise<CreateUserPreferencesDto> {
    const user = await this.findById(userId);
    
    const currentPreferences = await this.getPreferences(userId);
    const updatedPreferences: CreateUserPreferencesDto = {
      ...currentPreferences,
      ...updatePreferencesDto,
    };

    await this.userRepository.update(userId, {
      preferences: updatedPreferences as any,
    });

    return updatedPreferences;
  }

  async createFromOAuth(oauthData: {
    email: string;
    name: string;
    provider: string;
    providerId: string;
  }): Promise<User> {
    const existingUser = await this.findByEmail(oauthData.email);
    
    if (existingUser) {
      // Update provider info if needed
      await this.userRepository.update(existingUser.id, {
        oauth_provider: oauthData.provider,
        oauth_id: oauthData.providerId,
      });
      
      return await this.findById(existingUser.id);
    }

    // Create new user
    const newUser = this.userRepository.create({
      email: oauthData.email,
      name: oauthData.name,
      oauth_provider: oauthData.provider,
      oauth_id: oauthData.providerId,
      preferences: {
        email_notifications: true,
        marketing_emails: false,
        language: 'en',
        timezone: 'UTC',
      },
    });

    const savedUser = await this.userRepository.save(newUser);
    
    // Create default profile
    const profile = this.profileRepository.create({
      user_id: savedUser.id,
    });
    
    await this.profileRepository.save(profile);
    
    return await this.findById(savedUser.id);
  }

  async softDeleteAccount(userId: string): Promise<void> {
    const user = await this.findById(userId);
    
    await this.userRepository.update(userId, {
      deleted_at: new Date(),
    });
  }

  async restoreAccount(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      withDeleted: true,
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    if (!user.deleted_at) {
      throw new BadRequestException('Account is not deleted');
    }
    
    await this.userRepository.update(userId, {
      deleted_at: undefined,
    });
    
    return await this.findById(userId);
  }
}

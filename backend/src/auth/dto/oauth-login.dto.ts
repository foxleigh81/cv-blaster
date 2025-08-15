import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OAuthLoginDto {
  @ApiProperty({ description: 'User email from OAuth provider' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User name from OAuth provider' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'OAuth provider (github, linkedin)' })
  @IsString()
  @IsNotEmpty()
  oauth_provider: string;

  @ApiProperty({ description: 'OAuth provider user ID' })
  @IsString()
  @IsNotEmpty()
  oauth_id: string;

  @ApiProperty({ description: 'NextAuth session token', required: false })
  @IsString()
  @IsOptional()
  nextauth_token?: string;
}
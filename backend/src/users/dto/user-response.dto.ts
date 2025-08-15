import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

export class ProfileResponseDto {
  @ApiPropertyOptional({ description: 'User biography' })
  bio?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Location/address' })
  location?: string;

  @ApiPropertyOptional({ description: 'Personal website URL' })
  website?: string;

  @ApiPropertyOptional({ description: 'LinkedIn profile URL' })
  linkedin?: string;

  @ApiPropertyOptional({ description: 'GitHub profile URL' })
  github?: string;

  @ApiProperty({ description: 'Profile last updated timestamp' })
  @Transform(({ value }) => value?.toISOString())
  updated_at: string;
}

export class UserResponseDto {
  @ApiProperty({ description: 'User unique identifier' })
  id: string;

  @ApiProperty({ description: 'User email address' })
  email: string;

  @ApiProperty({ description: 'User full name' })
  name: string;

  @ApiProperty({ description: 'User role' })
  role: string;

  @ApiPropertyOptional({ description: 'OAuth provider used for authentication' })
  oauth_provider?: string;

  @ApiProperty({ description: 'Account creation timestamp' })
  @Transform(({ value }) => value?.toISOString())
  created_at: string;

  @ApiProperty({ description: 'Profile information' })
  profile?: ProfileResponseDto;

  // Exclude sensitive fields from response
  @Exclude()
  oauth_id: string;

  @Exclude()
  deleted_at: Date;
}
import { IsBoolean, IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserPreferencesDto {
  @ApiProperty({ 
    description: 'Whether email notifications are enabled',
    default: true 
  })
  @IsBoolean()
  email_notifications!: boolean;

  @ApiProperty({ 
    description: 'Whether marketing emails are enabled',
    default: false 
  })
  @IsBoolean()
  marketing_emails!: boolean;

  @ApiPropertyOptional({ 
    description: 'Preferred language',
    default: 'en' 
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ 
    description: 'User timezone',
    example: 'UTC' 
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ 
    description: 'Additional custom preferences'
  })
  @IsOptional()
  @IsObject()
  custom_settings?: { [key: string]: string | number | boolean };
}

export class UpdateUserPreferencesDto {
  @ApiPropertyOptional({ description: 'Whether email notifications are enabled' })
  @IsOptional()
  @IsBoolean()
  email_notifications?: boolean;

  @ApiPropertyOptional({ description: 'Whether marketing emails are enabled' })
  @IsOptional()
  @IsBoolean()
  marketing_emails?: boolean;

  @ApiPropertyOptional({ description: 'Preferred language' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ description: 'User timezone' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ description: 'Additional custom preferences' })
  @IsOptional()
  @IsObject()
  custom_settings?: { [key: string]: string | number | boolean };
}

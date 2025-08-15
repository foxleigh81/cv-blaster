[38;2;0;136;0;03m#!/bin/bash[39;00m

[38;2;170;34;255mcd[39m[38;2;187;187;187m [39m/Users/foxy/dev/internal/cv-blaster/backend

[38;2;170;34;255mecho[39m[38;2;187;187;187m [39m[38;2;187;68;68m"Fixing all backend issues..."[39m

[38;2;0;136;0;03m# Fix 1: Update employment.dto.ts[39;00m
cat[38;2;187;187;187m [39m>[38;2;187;187;187m [39msrc/profile/dto/employment.dto.ts[38;2;187;187;187m [39m[38;2;187;68;68m<< 'EOFILE'[39m
[38;2;187;68;68mimport { IsString, IsDateString, IsBoolean, IsOptional, IsObject, MaxLength } from 'class-validator';[39m
[38;2;187;68;68mimport { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';[39m
[38;2;187;68;68mimport { Type } from 'class-transformer';[39m

[38;2;187;68;68mexport class CreateEmploymentDto {[39m
[38;2;187;68;68m  @ApiProperty({ description: 'Company name' })[39m
[38;2;187;68;68m  @IsString()[39m
[38;2;187;68;68m  @MaxLength(255)[39m
[38;2;187;68;68m  company: string;[39m

[38;2;187;68;68m  @ApiProperty({ description: 'Position/job title' })[39m
[38;2;187;68;68m  @IsString()[39m
[38;2;187;68;68m  @MaxLength(255)[39m
[38;2;187;68;68m  position: string;[39m

[38;2;187;68;68m  @ApiProperty({ description: 'Employment start date', example: '2023-01-15' })[39m
[38;2;187;68;68m  @IsDateString()[39m
[38;2;187;68;68m  start_date: string;[39m

[38;2;187;68;68m  @ApiPropertyOptional({ description: 'Employment end date', example: '2023-12-15' })[39m
[38;2;187;68;68m  @IsOptional()[39m
[38;2;187;68;68m  @IsDateString()[39m
[38;2;187;68;68m  end_date?: string;[39m

[38;2;187;68;68m  @ApiPropertyOptional({ description: 'Is current job', default: false })[39m
[38;2;187;68;68m  @IsOptional()[39m
[38;2;187;68;68m  @IsBoolean()[39m
[38;2;187;68;68m  current?: boolean;[39m

[38;2;187;68;68m  @ApiPropertyOptional({ description: 'Job description' })[39m
[38;2;187;68;68m  @IsOptional()[39m
[38;2;187;68;68m  @IsString()[39m
[38;2;187;68;68m  description?: string;[39m

[38;2;187;68;68m  @ApiPropertyOptional({ [39m
[38;2;187;68;68m    description: 'Key achievements in structured format',[39m
[38;2;187;68;68m    example: { achievements: ['Increased sales by 30%', 'Led team of 5 developers'] }[39m
[38;2;187;68;68m  })[39m
[38;2;187;68;68m  @IsOptional()[39m
[38;2;187;68;68m  @IsObject()[39m
[38;2;187;68;68m  achievements?: Record<string, any>;[39m
[38;2;187;68;68m}[39m

[38;2;187;68;68mexport class UpdateEmploymentDto extends PartialType(CreateEmploymentDto) {}[39m

[38;2;187;68;68mexport class EmploymentResponseDto {[39m
[38;2;187;68;68m  @ApiProperty({ description: 'Employment record ID' })[39m
[38;2;187;68;68m  id: string;[39m

[38;2;187;68;68m  @ApiProperty({ description: 'Company name' })[39m
[38;2;187;68;68m  company: string;[39m

[38;2;187;68;68m  @ApiProperty({ description: 'Position/job title' })[39m
[38;2;187;68;68m  position: string;[39m

[38;2;187;68;68m  @ApiProperty({ description: 'Employment start date' })[39m
[38;2;187;68;68m  start_date: Date;[39m

[38;2;187;68;68m  @ApiPropertyOptional({ description: 'Employment end date' })[39m
[38;2;187;68;68m  end_date?: Date;[39m

[38;2;187;68;68m  @ApiProperty({ description: 'Is current job' })[39m
[38;2;187;68;68m  current: boolean;[39m

[38;2;187;68;68m  @ApiPropertyOptional({ description: 'Job description' })[39m
[38;2;187;68;68m  description?: string;[39m

[38;2;187;68;68m  @ApiPropertyOptional({ description: 'Key achievements' })[39m
[38;2;187;68;68m  achievements?: Record<string, any>;[39m

[38;2;187;68;68m  @ApiProperty({ description: 'Creation timestamp' })[39m
[38;2;187;68;68m  created_at: Date;[39m

[38;2;187;68;68m  @ApiProperty({ description: 'Last update timestamp' })[39m
[38;2;187;68;68m  updated_at: Date;[39m
[38;2;187;68;68m}[39m

[38;2;187;68;68mexport class BulkEmploymentDto {[39m
[38;2;187;68;68m  @ApiProperty({ [39m
[38;2;187;68;68m    description: 'Array of employment records to create/update',[39m
[38;2;187;68;68m    type: [CreateEmploymentDto][39m
[38;2;187;68;68m  })[39m
[38;2;187;68;68m  @Type(() => CreateEmploymentDto)[39m
[38;2;187;68;68m  employment: CreateEmploymentDto[];[39m
[38;2;187;68;68m}[39m
[38;2;187;68;68mEOFILE[39m

[38;2;0;136;0;03m# Fix 2: Update user-preferences.dto.ts[39;00m
cat[38;2;187;187;187m [39m>[38;2;187;187;187m [39msrc/users/dto/user-preferences.dto.ts[38;2;187;187;187m [39m[38;2;187;68;68m<< 'EOFILE'[39m
[38;2;187;68;68mimport { IsBoolean, IsString, IsOptional, IsObject } from 'class-validator';[39m
[38;2;187;68;68mimport { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';[39m

[38;2;187;68;68mexport class CreateUserPreferencesDto {[39m
[38;2;187;68;68m  @ApiProperty({ [39m
[38;2;187;68;68m    description: 'Whether email notifications are enabled',[39m
[38;2;187;68;68m    default: true [39m
[38;2;187;68;68m  })[39m
[38;2;187;68;68m  @IsBoolean()[39m
[38;2;187;68;68m  email_notifications: boolean;[39m

[38;2;187;68;68m  @ApiProperty({ [39m
[38;2;187;68;68m    description: 'Whether marketing emails are enabled',[39m
[38;2;187;68;68m    default: false [39m
[38;2;187;68;68m  })[39m
[38;2;187;68;68m  @IsBoolean()[39m
[38;2;187;68;68m  marketing_emails: boolean;[39m

[38;2;187;68;68m  @ApiPropertyOptional({ [39m
[38;2;187;68;68m    description: 'Preferred language',[39m
[38;2;187;68;68m    default: 'en' [39m
[38;2;187;68;68m  })[39m
[38;2;187;68;68m  @IsOptional()[39m
[38;2;187;68;68m  @IsString()[39m
[38;2;187;68;68m  language?: string;[39m

[38;2;187;68;68m  @ApiPropertyOptional({ [39m
[38;2;187;68;68m    description: 'User timezone',[39m
[38;2;187;68;68m    example: 'UTC' [39m
[38;2;187;68;68m  })[39m
[38;2;187;68;68m  @IsOptional()[39m
[38;2;187;68;68m  @IsString()[39m
[38;2;187;68;68m  timezone?: string;[39m

[38;2;187;68;68m  @ApiPropertyOptional({ [39m
[38;2;187;68;68m    description: 'Additional custom preferences'[39m
[38;2;187;68;68m  })[39m
[38;2;187;68;68m  @IsOptional()[39m
[38;2;187;68;68m  @IsObject()[39m
[38;2;187;68;68m  custom_settings?: Record<string, any>;[39m
[38;2;187;68;68m}[39m

[38;2;187;68;68mexport class UpdateUserPreferencesDto {[39m
[38;2;187;68;68m  @ApiPropertyOptional({ description: 'Whether email notifications are enabled' })[39m
[38;2;187;68;68m  @IsOptional()[39m
[38;2;187;68;68m  @IsBoolean()[39m
[38;2;187;68;68m  email_notifications?: boolean;[39m

[38;2;187;68;68m  @ApiPropertyOptional({ description: 'Whether marketing emails are enabled' })[39m
[38;2;187;68;68m  @IsOptional()[39m
[38;2;187;68;68m  @IsBoolean()[39m
[38;2;187;68;68m  marketing_emails?: boolean;[39m

[38;2;187;68;68m  @ApiPropertyOptional({ description: 'Preferred language' })[39m
[38;2;187;68;68m  @IsOptional()[39m
[38;2;187;68;68m  @IsString()[39m
[38;2;187;68;68m  language?: string;[39m

[38;2;187;68;68m  @ApiPropertyOptional({ description: 'User timezone' })[39m
[38;2;187;68;68m  @IsOptional()[39m
[38;2;187;68;68m  @IsString()[39m
[38;2;187;68;68m  timezone?: string;[39m

[38;2;187;68;68m  @ApiPropertyOptional({ description: 'Additional custom preferences' })[39m
[38;2;187;68;68m  @IsOptional()[39m
[38;2;187;68;68m  @IsObject()[39m
[38;2;187;68;68m  custom_settings?: Record<string, any>;[39m
[38;2;187;68;68m}[39m
[38;2;187;68;68mEOFILE[39m

[38;2;170;34;255mecho[39m[38;2;187;187;187m [39m[38;2;187;68;68m"DTOs fixed. Now fixing services..."[39m

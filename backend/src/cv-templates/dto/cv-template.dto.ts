import { TemplateStructure, TemplateStyles } from '../../types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsBoolean } from 'class-validator';

export class CVTemplateDto {
  @ApiProperty({ description: 'Template ID' })
  id!: string;

  @ApiProperty({ description: 'Template name' })
  name!: string;

  @ApiProperty({ description: 'Template description', required: false })
  description?: string;

  @ApiProperty({ description: 'Template structure configuration' })
  structure!: TemplateStructure;

  @ApiProperty({
    description: 'Template styles configuration',
    required: false,
  })
  styles?: TemplateStyles;

  @ApiProperty({ description: 'Whether template is active', default: true })
  active!: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at!: Date;
}

export class CreateCVTemplateDto {
  @ApiProperty({ description: 'Template name' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Template description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Template structure configuration' })
  @IsObject()
  structure!: TemplateStructure;

  @ApiProperty({
    description: 'Template styles configuration',
    required: false,
  })
  @IsOptional()
  @IsObject()
  styles?: TemplateStyles;

  @ApiProperty({ description: 'Whether template is active', default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateCVTemplateDto {
  @ApiProperty({ description: 'Template name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Template description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Template structure configuration',
    required: false,
  })
  @IsOptional()
  @IsObject()
  structure?: TemplateStructure;

  @ApiProperty({
    description: 'Template styles configuration',
    required: false,
  })
  @IsOptional()
  @IsObject()
  styles?: TemplateStyles;

  @ApiProperty({ description: 'Whether template is active', required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

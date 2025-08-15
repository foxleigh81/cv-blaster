import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsUUID, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CVData, CVSettings, SectionContent, CustomSectionContent } from '../../types';

export class CVDto {
  @ApiProperty({ description: 'CV ID' })
  id!: string;

  @ApiProperty({ description: 'User ID' })
  user_id!: string;

  @ApiProperty({ description: 'Template ID' })
  template_id!: string;

  @ApiProperty({ description: 'CV name' })
  name!: string;

  @ApiProperty({ description: 'CV data', required: false })
  data?: CVData;

  @ApiProperty({ description: 'CV settings', required: false })
  settings?: CVSettings;

  @ApiProperty({ description: 'Whether this is the default CV', default: false })
  is_default!: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at!: Date;

  @ApiProperty({ description: 'CV sections', required: false })
  sections?: CVSectionDto[];

  @ApiProperty({ description: 'Template information', required: false })
  template?: {
    id: string;
    name: string;
    description?: string;
  };
}

export class CVSectionDto {
  @ApiProperty({ description: 'Section ID' })
  id!: string;

  @ApiProperty({ description: 'CV ID' })
  cv_id!: string;

  @ApiProperty({ description: 'Section type' })
  section_type!: string;

  @ApiProperty({ description: 'Section title' })
  title!: string;

  @ApiProperty({ description: 'Section content' })
  content!: SectionContent;

  @ApiProperty({ description: 'Section order', default: 0 })
  order!: number;

  @ApiProperty({ description: 'Section visibility', default: true })
  visible!: boolean;
}

export class CreateCVDto {
  @ApiProperty({ description: 'CV name' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Template ID' })
  @IsUUID()
  template_id!: string;

  @ApiProperty({ description: 'Custom CV data', required: false })
  @IsOptional()
  @IsObject()
  data?: CVData;

  @ApiProperty({ description: 'CV settings', required: false })
  @IsOptional()
  @IsObject()
  settings?: CVSettings;

  @ApiProperty({ description: 'Set as default CV', default: false })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}

export class UpdateCVDto {
  @ApiProperty({ description: 'CV name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Template ID', required: false })
  @IsOptional()
  @IsUUID()
  template_id?: string;

  @ApiProperty({ description: 'CV data', required: false })
  @IsOptional()
  @IsObject()
  data?: CVData;

  @ApiProperty({ description: 'CV settings', required: false })
  @IsOptional()
  @IsObject()
  settings?: CVSettings;

  @ApiProperty({ description: 'Set as default CV', required: false })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}

export class DuplicateCVDto {
  @ApiProperty({ description: 'Name for the duplicated CV' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'New template ID for the duplicated CV', required: false })
  @IsOptional()
  @IsUUID()
  template_id?: string;
}

export class CVListItemDto {
  @ApiProperty({ description: 'CV ID' })
  id!: string;

  @ApiProperty({ description: 'CV name' })
  name!: string;

  @ApiProperty({ description: 'Template name' })
  template_name!: string;

  @ApiProperty({ description: 'Whether this is the default CV' })
  is_default!: boolean;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at!: Date;

  @ApiProperty({ description: 'Number of sections' })
  sections_count!: number;
}

export class CustomSectionDto {
  @ApiProperty({ description: 'Section title' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Section content' })
  @IsObject()
  content!: CustomSectionContent;
}

export class CreateCVFromProfileDto {
  @ApiProperty({ description: 'CV name' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Template ID' })
  @IsUUID()
  template_id!: string;

  @ApiProperty({ description: 'Include employment history', default: true })
  @IsOptional()
  @IsBoolean()
  include_employment?: boolean;

  @ApiProperty({ description: 'Include education', default: true })
  @IsOptional()
  @IsBoolean()
  include_education?: boolean;

  @ApiProperty({ description: 'Include skills', default: true })
  @IsOptional()
  @IsBoolean()
  include_skills?: boolean;

  @ApiProperty({ description: 'Include certificates', default: true })
  @IsOptional()
  @IsBoolean()
  include_certificates?: boolean;

  @ApiProperty({ description: 'Include awards', default: true })
  @IsOptional()
  @IsBoolean()
  include_awards?: boolean;

  @ApiProperty({ description: 'Custom sections to include', required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CustomSectionDto)
  custom_sections?: CustomSectionDto[];
}

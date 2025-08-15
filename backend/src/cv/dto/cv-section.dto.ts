import { ApiProperty } from '@nestjs/swagger';
import { SectionContent } from '../../types';
import { IsString, IsOptional, IsObject, IsBoolean, IsNumber, Min, IsArray } from 'class-validator';

export class UpdateSectionDto {
  @ApiProperty({ description: 'Section title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Section content', required: false })
  @IsOptional()
  @IsObject()
  content?: SectionContent;

  @ApiProperty({ description: 'Section visibility', required: false })
  @IsOptional()
  @IsBoolean()
  visible?: boolean;
}

export class CreateCustomSectionDto {
  @ApiProperty({ description: 'Section title' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Section content' })
  @IsObject()
  content!: SectionContent;

  @ApiProperty({ description: 'Section order position', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;

  @ApiProperty({ description: 'Section visibility', default: true })
  @IsOptional()
  @IsBoolean()
  visible?: boolean;
}

export class ReorderSectionsDto {
  @ApiProperty({ 
    description: 'Array of section IDs in the desired order',
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  section_ids!: string[];
}

export class UpdateSectionVisibilityDto {
  @ApiProperty({ description: 'Section visibility' })
  @IsBoolean()
  visible!: boolean;
}

export class BulkUpdateSectionsDto {
  @ApiProperty({ 
    description: 'Array of section updates',
    type: [Object]
  })
  @IsArray()
  sections!: Array<{
    id: string;
    title?: string;
    content?: SectionContent;
    visible?: boolean;
    order?: number;
  }>;
}

export class CVSectionResponseDto {
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

  @ApiProperty({ description: 'Section order' })
  order!: number;

  @ApiProperty({ description: 'Section visibility' })
  visible!: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at!: Date;
}
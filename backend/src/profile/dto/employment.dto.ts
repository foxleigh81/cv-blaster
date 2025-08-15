import { IsString, IsDateString, IsBoolean, IsOptional, IsObject, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateEmploymentDto {
  @ApiProperty({ description: 'Company name' })
  @IsString()
  @MaxLength(255)
  company: string;

  @ApiProperty({ description: 'Position/job title' })
  @IsString()
  @MaxLength(255)
  position: string;

  @ApiProperty({ description: 'Employment start date', example: '2023-01-15' })
  @IsDateString()
  start_date: string;

  @ApiPropertyOptional({ description: 'Employment end date', example: '2023-12-15' })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({ description: 'Is current job', default: false })
  @IsOptional()
  @IsBoolean()
  current?: boolean;

  @ApiPropertyOptional({ description: 'Job description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Key achievements in structured format',
    example: { achievements: ['Increased sales by 30%', 'Led team of 5 developers'] }
  })
  @IsOptional()
  @IsObject()
  achievements?: Record<string, any>;
}

export class UpdateEmploymentDto extends PartialType(CreateEmploymentDto) {}

export class EmploymentResponseDto {
  @ApiProperty({ description: 'Employment record ID' })
  id: string;

  @ApiProperty({ description: 'Company name' })
  company: string;

  @ApiProperty({ description: 'Position/job title' })
  position: string;

  @ApiProperty({ description: 'Employment start date' })
  start_date: Date;

  @ApiPropertyOptional({ description: 'Employment end date' })
  end_date?: Date;

  @ApiProperty({ description: 'Is current job' })
  current: boolean;

  @ApiPropertyOptional({ description: 'Job description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Key achievements' })
  achievements?: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: Date;
}

export class BulkEmploymentDto {
  @ApiProperty({ 
    description: 'Array of employment records to create/update',
    type: [CreateEmploymentDto]
  })
  @Type(() => CreateEmploymentDto)
  employment: CreateEmploymentDto[];
}

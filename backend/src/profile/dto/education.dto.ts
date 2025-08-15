import { IsString, IsDateString, IsOptional, IsNumber, MaxLength, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateEducationDto {
  @ApiProperty({ description: 'Educational institution name' })
  @IsString()
  @MaxLength(255)
  institution: string;

  @ApiProperty({ description: 'Degree obtained' })
  @IsString()
  @MaxLength(255)
  degree: string;

  @ApiPropertyOptional({ description: 'Field of study' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  field?: string;

  @ApiPropertyOptional({ description: 'Graduation date', example: '2023-06-15' })
  @IsOptional()
  @IsDateString()
  graduation_date?: string;

  @ApiPropertyOptional({ description: 'Additional description or details' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Grade Point Average (0.00 - 4.00)',
    minimum: 0,
    maximum: 4,
    example: 3.75
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(4)
  gpa?: number;
}

export class UpdateEducationDto extends PartialType(CreateEducationDto) {}

export class EducationResponseDto {
  @ApiProperty({ description: 'Education record ID' })
  id: string;

  @ApiProperty({ description: 'Educational institution name' })
  institution: string;

  @ApiProperty({ description: 'Degree obtained' })
  degree: string;

  @ApiPropertyOptional({ description: 'Field of study' })
  field?: string;

  @ApiPropertyOptional({ description: 'Graduation date' })
  graduation_date?: string;

  @ApiPropertyOptional({ description: 'Additional description or details' })
  description?: string;

  @ApiPropertyOptional({ description: 'Grade Point Average' })
  gpa?: number;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: string;
}

export class BulkEducationDto {
  @ApiProperty({ 
    description: 'Array of education records to create/update',
    type: [CreateEducationDto]
  })
  @Type(() => CreateEducationDto)
  education: CreateEducationDto[];
}
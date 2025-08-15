import { IsString, IsOptional, IsNumber, IsArray, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSkillDto {
  @ApiProperty({ description: 'Skill name' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Skill category (e.g., Programming, Design, Management)' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Skill description' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateSkillDto extends PartialType(CreateSkillDto) {}

export class AddUserSkillDto {
  @ApiProperty({ description: 'Skill ID to add to user' })
  @IsString()
  skill_id!: string;

  @ApiProperty({ 
    description: 'Proficiency level (1-5 scale)',
    minimum: 1,
    maximum: 5,
    example: 4
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  proficiency!: number;

  @ApiPropertyOptional({ 
    description: 'Years of experience with this skill',
    example: 3
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  years?: number;
}

export class CreateUserSkillDto {
  @ApiProperty({ description: 'Skill name' })
  @IsString()
  skill_name!: string;

  @ApiPropertyOptional({ description: 'Skill category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ 
    description: 'Proficiency level (1-5 scale)',
    minimum: 1,
    maximum: 5,
    example: 4
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  proficiency!: number;

  @ApiPropertyOptional({ 
    description: 'Years of experience',
    example: 3
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  years?: number;
}

export class UpdateUserSkillDto {
  @ApiProperty({ 
    description: 'Proficiency level (1-5 scale)',
    minimum: 1,
    maximum: 5
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  proficiency?: number;

  @ApiPropertyOptional({ description: 'Years of experience' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  years?: number;
}

export class SkillResponseDto {
  @ApiProperty({ description: 'Skill ID' })
  id!: string;

  @ApiProperty({ description: 'Skill name' })
  name!: string;

  @ApiPropertyOptional({ description: 'Skill category' })
  category?: string;

  @ApiPropertyOptional({ description: 'Skill description' })
  description?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at!: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at!: string;
}

export class UserSkillResponseDto {
  @ApiProperty({ description: 'User skill relationship ID' })
  skill_id!: string;

  @ApiProperty({ description: 'Skill details' })
  skill!: SkillResponseDto;

  @ApiProperty({ description: 'Proficiency level (1-5)' })
  proficiency!: number;

  @ApiPropertyOptional({ description: 'Years of experience' })
  years?: number;
}

export class BulkSkillsDto {
  @ApiProperty({ 
    description: 'Array of user skills to create/update',
    type: [CreateUserSkillDto]
  })
  @Type(() => CreateUserSkillDto)
  skills!: CreateUserSkillDto[];
}
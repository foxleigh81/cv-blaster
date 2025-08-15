import { IsString, IsDateString, IsOptional, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAwardDto {
  @ApiProperty({ description: 'Award title/name' })
  @IsString()
  @MaxLength(255)
  title!: string;

  @ApiPropertyOptional({ description: 'Award issuing organization' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  issuer?: string;

  @ApiPropertyOptional({ description: 'Date award was received', example: '2023-04-20' })
  @IsOptional()
  @IsDateString()
  date_received?: string;

  @ApiPropertyOptional({ description: 'Award description or details' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'URL with more information about the award' })
  @IsOptional()
  @IsUrl()
  url?: string;
}

export class UpdateAwardDto extends PartialType(CreateAwardDto) {}

export class AwardResponseDto {
  @ApiProperty({ description: 'Award ID' })
  id!: string;

  @ApiProperty({ description: 'Award title/name' })
  title!: string;

  @ApiPropertyOptional({ description: 'Award issuing organization' })
  issuer?: string;

  @ApiPropertyOptional({ description: 'Date award was received' })
  date_received?: string;

  @ApiPropertyOptional({ description: 'Award description or details' })
  description?: string;

  @ApiPropertyOptional({ description: 'URL with more information about the award' })
  url?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at!: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at!: string;
}

export class BulkAwardsDto {
  @ApiProperty({ 
    description: 'Array of award records to create/update',
    type: [CreateAwardDto]
  })
  @Type(() => CreateAwardDto)
  awards!: CreateAwardDto[];
}
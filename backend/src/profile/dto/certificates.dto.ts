import { IsString, IsDateString, IsOptional, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCertificateDto {
  @ApiProperty({ description: 'Certificate name/title' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({ description: 'Certificate issuing organization' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  issuer?: string;

  @ApiPropertyOptional({ description: 'Certificate issue date', example: '2023-05-15' })
  @IsOptional()
  @IsDateString()
  issue_date?: string;

  @ApiPropertyOptional({ description: 'Certificate expiry date', example: '2026-05-15' })
  @IsOptional()
  @IsDateString()
  expiry_date?: string;

  @ApiPropertyOptional({ description: 'Certificate credential ID' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  credential_id?: string;

  @ApiPropertyOptional({ description: 'URL to verify the certificate' })
  @IsOptional()
  @IsUrl()
  credential_url?: string;

  @ApiPropertyOptional({ description: 'Additional description or details' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCertificateDto extends PartialType(CreateCertificateDto) {}

export class CertificateResponseDto {
  @ApiProperty({ description: 'Certificate ID' })
  id!: string;

  @ApiProperty({ description: 'Certificate name/title' })
  name!: string;

  @ApiPropertyOptional({ description: 'Certificate issuing organization' })
  issuer?: string;

  @ApiPropertyOptional({ description: 'Certificate issue date' })
  issue_date?: string;

  @ApiPropertyOptional({ description: 'Certificate expiry date' })
  expiry_date?: string;

  @ApiPropertyOptional({ description: 'Certificate credential ID' })
  credential_id?: string;

  @ApiPropertyOptional({ description: 'URL to verify the certificate' })
  credential_url?: string;

  @ApiPropertyOptional({ description: 'Additional description or details' })
  description?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at!: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at!: string;
}

export class BulkCertificatesDto {
  @ApiProperty({ 
    description: 'Array of certificate records to create/update',
    type: [CreateCertificateDto]
  })
  @Type(() => CreateCertificateDto)
  certificates!: CreateCertificateDto[];
}
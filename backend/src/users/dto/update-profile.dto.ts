import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ 
    description: 'User biography',
    maxLength: 2000 
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @ApiPropertyOptional({ 
    description: 'Phone number',
    maxLength: 50 
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'Location/address',
    maxLength: 255 
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @ApiPropertyOptional({ 
    description: 'Personal website URL' 
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ 
    description: 'LinkedIn profile URL' 
  })
  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @ApiPropertyOptional({ 
    description: 'GitHub profile URL' 
  })
  @IsOptional()
  @IsUrl()
  github?: string;
}
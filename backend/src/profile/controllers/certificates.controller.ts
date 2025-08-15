import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CertificatesService } from '../services/certificates.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { 
  CreateCertificateDto, 
  UpdateCertificateDto, 
  CertificateResponseDto,
  BulkCertificatesDto 
} from '../dto/certificates.dto';
import { plainToClass } from 'class-transformer';

@ApiTags('Profile - Certificates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/profile/certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all certificates for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Certificates retrieved successfully',
    type: [CertificateResponseDto],
  })
  async findAll(@CurrentUser() user: User): Promise<CertificateResponseDto[]> {
    const certificates = await this.certificatesService.findAll(user.id);
    return certificates.map(cert => plainToClass(CertificateResponseDto, {
      ...cert,
      issue_date: cert.issue_date?.toISOString(),
      expiry_date: cert.expiry_date?.toISOString(),
      created_at: cert.created_at.toISOString(),
      updated_at: cert.updated_at.toISOString(),
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific certificate' })
  @ApiParam({ name: 'id', description: 'Certificate ID' })
  @ApiResponse({
    status: 200,
    description: 'Certificate retrieved successfully',
    type: CertificateResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Certificate not found',
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<CertificateResponseDto> {
    const certificate = await this.certificatesService.findOne(id, user.id);
    return plainToClass(CertificateResponseDto, {
      ...certificate,
      issue_date: certificate.issue_date?.toISOString(),
      expiry_date: certificate.expiry_date?.toISOString(),
      created_at: certificate.created_at.toISOString(),
      updated_at: certificate.updated_at.toISOString(),
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new certificate' })
  @ApiResponse({
    status: 201,
    description: 'Certificate created successfully',
    type: CertificateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async create(
    @Body() createCertificateDto: CreateCertificateDto,
    @CurrentUser() user: User,
  ): Promise<CertificateResponseDto> {
    const certificate = await this.certificatesService.create(user.id, createCertificateDto);
    return plainToClass(CertificateResponseDto, {
      ...certificate,
      issue_date: certificate.issue_date?.toISOString(),
      expiry_date: certificate.expiry_date?.toISOString(),
      created_at: certificate.created_at.toISOString(),
      updated_at: certificate.updated_at.toISOString(),
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a certificate' })
  @ApiParam({ name: 'id', description: 'Certificate ID' })
  @ApiResponse({
    status: 200,
    description: 'Certificate updated successfully',
    type: CertificateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Certificate not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCertificateDto: UpdateCertificateDto,
    @CurrentUser() user: User,
  ): Promise<CertificateResponseDto> {
    const certificate = await this.certificatesService.update(id, user.id, updateCertificateDto);
    return plainToClass(CertificateResponseDto, {
      ...certificate,
      issue_date: certificate.issue_date?.toISOString(),
      expiry_date: certificate.expiry_date?.toISOString(),
      created_at: certificate.created_at.toISOString(),
      updated_at: certificate.updated_at.toISOString(),
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a certificate' })
  @ApiParam({ name: 'id', description: 'Certificate ID' })
  @ApiResponse({
    status: 204,
    description: 'Certificate deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Certificate not found',
  })
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    await this.certificatesService.remove(id, user.id);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create/update certificates' })
  @ApiResponse({
    status: 201,
    description: 'Certificates processed successfully',
    type: [CertificateResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async bulkCreate(
    @Body() bulkCertificatesDto: BulkCertificatesDto,
    @CurrentUser() user: User,
  ): Promise<CertificateResponseDto[]> {
    const certificates = await this.certificatesService.bulkCreate(user.id, bulkCertificatesDto.certificates);
    return certificates.map(cert => plainToClass(CertificateResponseDto, {
      ...cert,
      issue_date: cert.issue_date?.toISOString(),
      expiry_date: cert.expiry_date?.toISOString(),
      created_at: cert.created_at.toISOString(),
      updated_at: cert.updated_at.toISOString(),
    }));
  }
}
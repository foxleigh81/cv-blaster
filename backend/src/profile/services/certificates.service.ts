import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from '../entities/certificate.entity';
import { CreateCertificateDto, UpdateCertificateDto } from '../dto/certificates.dto';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
  ) {}

  async findAll(userId: string): Promise<Certificate[]> {
    return await this.certificateRepository.find({
      where: { user_id: userId },
      order: { issue_date: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return certificate;
  }

  async create(userId: string, createCertificateDto: CreateCertificateDto): Promise<Certificate> {
    const certificate = this.certificateRepository.create({
      ...createCertificateDto,
      user_id: userId,
      issue_date: createCertificateDto.issue_date 
        ? new Date(createCertificateDto.issue_date) 
        : undefined,
      expiry_date: createCertificateDto.expiry_date 
        ? new Date(createCertificateDto.expiry_date) 
        : undefined,
    });

    return await this.certificateRepository.save(certificate);
  }

  async update(
    id: string,
    userId: string,
    updateCertificateDto: UpdateCertificateDto,
  ): Promise<Certificate> {
    const certificate = await this.findOne(id, userId);

    const updateData: any = {
      ...updateCertificateDto,
    };

    if (updateCertificateDto.issue_date !== undefined) {
      updateData.issue_date = updateCertificateDto.issue_date 
        ? new Date(updateCertificateDto.issue_date) 
        : null;
    }

    if (updateCertificateDto.expiry_date !== undefined) {
      updateData.expiry_date = updateCertificateDto.expiry_date 
        ? new Date(updateCertificateDto.expiry_date) 
        : null;
    }

    Object.assign(certificate, updateData);
    return await this.certificateRepository.save(certificate);
  }

  async remove(id: string, userId: string): Promise<void> {
    const certificate = await this.findOne(id, userId);
    await this.certificateRepository.remove(certificate);
  }

  async bulkCreate(userId: string, certificatesData: CreateCertificateDto[]): Promise<Certificate[]> {
    const certificateRecords = certificatesData.map(data => 
      this.certificateRepository.create({
        ...data,
        user_id: userId,
        issue_date: data.issue_date ? new Date(data.issue_date) : undefined,
        expiry_date: data.expiry_date ? new Date(data.expiry_date) : undefined,
      })
    );

    return await this.certificateRepository.save(certificateRecords);
  }

  async removeAll(userId: string): Promise<void> {
    await this.certificateRepository.delete({ user_id: userId });
  }
}

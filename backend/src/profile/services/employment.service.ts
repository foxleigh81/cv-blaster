import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employment } from '../entities/employment.entity';
import { CreateEmploymentDto, UpdateEmploymentDto } from '../dto/employment.dto';

@Injectable()
export class EmploymentService {
  constructor(
    @InjectRepository(Employment)
    private readonly employmentRepository: Repository<Employment>,
  ) {}

  async findAll(userId: string): Promise<Employment[]> {
    return await this.employmentRepository.find({
      where: { user_id: userId },
      order: { start_date: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Employment> {
    const employment = await this.employmentRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!employment) {
      throw new NotFoundException('Employment record not found');
    }

    return employment;
  }

  async create(userId: string, createEmploymentDto: CreateEmploymentDto): Promise<Employment> {
    const employment = this.employmentRepository.create({
      ...createEmploymentDto,
      user_id: userId,
      start_date: new Date(createEmploymentDto.start_date),
      end_date: createEmploymentDto.end_date 
        ? new Date(createEmploymentDto.end_date) 
        : undefined,
    });

    return await this.employmentRepository.save(employment);
  }

  async update(
    id: string,
    userId: string,
    updateEmploymentDto: UpdateEmploymentDto,
  ): Promise<Employment> {
    const employment = await this.findOne(id, userId);

    const updateData: any = {
      ...updateEmploymentDto,
    };

    if (updateEmploymentDto.start_date !== undefined) {
      updateData.start_date = new Date(updateEmploymentDto.start_date);
    }

    if (updateEmploymentDto.end_date !== undefined) {
      updateData.end_date = updateEmploymentDto.end_date 
        ? new Date(updateEmploymentDto.end_date) 
        : null;
    }

    Object.assign(employment, updateData);
    return await this.employmentRepository.save(employment);
  }

  async remove(id: string, userId: string): Promise<void> {
    const employment = await this.findOne(id, userId);
    await this.employmentRepository.remove(employment);
  }

  async bulkCreate(userId: string, employmentData: CreateEmploymentDto[]): Promise<Employment[]> {
    const employmentRecords = employmentData.map(data => 
      this.employmentRepository.create({
        ...data,
        user_id: userId,
        start_date: new Date(data.start_date),
        end_date: data.end_date ? new Date(data.end_date) : undefined,
      })
    );

    return await this.employmentRepository.save(employmentRecords);
  }

  async removeAll(userId: string): Promise<void> {
    await this.employmentRepository.delete({ user_id: userId });
  }
}

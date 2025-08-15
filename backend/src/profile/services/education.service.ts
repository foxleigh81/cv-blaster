import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from '../entities/education.entity';
import { CreateEducationDto, UpdateEducationDto } from '../dto/education.dto';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
  ) {}

  async findAll(userId: string): Promise<Education[]> {
    return await this.educationRepository.find({
      where: { user_id: userId },
      order: { graduation_date: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Education> {
    const education = await this.educationRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!education) {
      throw new NotFoundException('Education record not found');
    }

    return education;
  }

  async create(userId: string, createEducationDto: CreateEducationDto): Promise<Education> {
    const education = this.educationRepository.create({
      ...createEducationDto,
      user_id: userId,
      graduation_date: createEducationDto.graduation_date 
        ? new Date(createEducationDto.graduation_date) 
        : undefined,
    });

    return await this.educationRepository.save(education);
  }

  async update(
    id: string,
    userId: string,
    updateEducationDto: UpdateEducationDto,
  ): Promise<Education> {
    const education = await this.findOne(id, userId);

    const updateData: any = {
      ...updateEducationDto,
    };

    if (updateEducationDto.graduation_date !== undefined) {
      updateData.graduation_date = updateEducationDto.graduation_date 
        ? new Date(updateEducationDto.graduation_date) 
        : null;
    }

    Object.assign(education, updateData);
    return await this.educationRepository.save(education);
  }

  async remove(id: string, userId: string): Promise<void> {
    const education = await this.findOne(id, userId);
    await this.educationRepository.remove(education);
  }

  async bulkCreate(userId: string, educationData: CreateEducationDto[]): Promise<Education[]> {
    const educationRecords = educationData.map(data => 
      this.educationRepository.create({
        ...data,
        user_id: userId,
        graduation_date: data.graduation_date ? new Date(data.graduation_date) : undefined,
      })
    );

    return await this.educationRepository.save(educationRecords);
  }

  async removeAll(userId: string): Promise<void> {
    await this.educationRepository.delete({ user_id: userId });
  }
}

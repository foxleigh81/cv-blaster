import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Award } from '../entities/award.entity';
import { CreateAwardDto, UpdateAwardDto } from '../dto/awards.dto';

@Injectable()
export class AwardsService {
  constructor(
    @InjectRepository(Award)
    private readonly awardRepository: Repository<Award>,
  ) {}

  async findAll(userId: string): Promise<Award[]> {
    return await this.awardRepository.find({
      where: { user_id: userId },
      order: { date_received: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Award> {
    const award = await this.awardRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!award) {
      throw new NotFoundException('Award not found');
    }

    return award;
  }

  async create(userId: string, createAwardDto: CreateAwardDto): Promise<Award> {
    const award = this.awardRepository.create({
      ...createAwardDto,
      user_id: userId,
      date_received: createAwardDto.date_received 
        ? new Date(createAwardDto.date_received) 
        : undefined,
    });

    return await this.awardRepository.save(award);
  }

  async update(
    id: string,
    userId: string,
    updateAwardDto: UpdateAwardDto,
  ): Promise<Award> {
    const award = await this.findOne(id, userId);

    const updateData: any = {
      ...updateAwardDto,
    };

    if (updateAwardDto.date_received !== undefined) {
      updateData.date_received = updateAwardDto.date_received 
        ? new Date(updateAwardDto.date_received) 
        : null;
    }

    Object.assign(award, updateData);
    return await this.awardRepository.save(award);
  }

  async remove(id: string, userId: string): Promise<void> {
    const award = await this.findOne(id, userId);
    await this.awardRepository.remove(award);
  }

  async bulkCreate(userId: string, awardsData: CreateAwardDto[]): Promise<Award[]> {
    const awardRecords = awardsData.map(data => 
      this.awardRepository.create({
        ...data,
        user_id: userId,
        date_received: data.date_received ? new Date(data.date_received) : undefined,
      })
    );

    return await this.awardRepository.save(awardRecords);
  }

  async removeAll(userId: string): Promise<void> {
    await this.awardRepository.delete({ user_id: userId });
  }
}

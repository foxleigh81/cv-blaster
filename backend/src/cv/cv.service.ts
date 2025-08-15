import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CV } from './entities/cv.entity';
import { CVSection } from './entities/cv-section.entity';
import { CreateCVDto, UpdateCVDto, CVListItemDto } from './dto/cv.dto';
import { CVData, CVSettings, CVStatistics } from '../types';

@Injectable()
export class CVService {
  constructor(
    @InjectRepository(CV)
    private readonly cvRepository: Repository<CV>,
    @InjectRepository(CVSection)
    private readonly sectionRepository: Repository<CVSection>,
  ) {}

  async findAllByUser(userId: string): Promise<CVListItemDto[]> {
    const cvs = await this.cvRepository
      .createQueryBuilder('cv')
      .leftJoinAndSelect('cv.template', 'template')
      .leftJoin('cv.sections', 'sections')
      .addSelect('COUNT(sections.id)', 'sections_count')
      .where('cv.user_id = :userId', { userId })
      .groupBy('cv.id, template.id')
      .orderBy('cv.updated_at', 'DESC')
      .getMany();

    return cvs.map(cv => ({
      id: cv.id,
      name: cv.name,
      template_name: cv.template?.name || 'Unknown Template',
      is_default: cv.is_default,
      updated_at: cv.updated_at,
      sections_count: cv.sections?.length || 0,
    }));
  }

  async findById(id: string, userId: string): Promise<CV> {
    const cv = await this.cvRepository.findOne({
      where: { id, user_id: userId },
      relations: ['sections', 'template'],
      order: {
        sections: {
          order: 'ASC',
        },
      },
    });

    if (!cv) {
      throw new NotFoundException('CV not found');
    }

    return cv;
  }

  async create(userId: string, createCVDto: CreateCVDto): Promise<CV> {
    // If setting as default, unset other default CVs
    if (createCVDto.is_default) {
      await this.unsetDefaultCVs(userId);
    }

    const cv = this.cvRepository.create({
      ...createCVDto,
      user_id: userId,
    });

    return this.cvRepository.save(cv);
  }

  async update(id: string, userId: string, updateCVDto: UpdateCVDto): Promise<CV> {
    const cv = await this.findById(id, userId);

    // If setting as default, unset other default CVs
    if (updateCVDto.is_default) {
      await this.unsetDefaultCVs(userId, id);
    }

    Object.assign(cv, updateCVDto);
    return this.cvRepository.save(cv);
  }

  async delete(id: string, userId: string): Promise<void> {
    const cv = await this.findById(id, userId);
    
    // Delete associated sections first (cascade should handle this, but being explicit)
    await this.sectionRepository.delete({ cv_id: id });
    
    await this.cvRepository.remove(cv);
  }

  async setAsDefault(id: string, userId: string): Promise<CV> {
    const cv = await this.findById(id, userId);
    
    // Unset other default CVs
    await this.unsetDefaultCVs(userId, id);
    
    cv.is_default = true;
    return this.cvRepository.save(cv);
  }

  async getDefaultCV(userId: string): Promise<CV | null> {
    return this.cvRepository.findOne({
      where: { user_id: userId, is_default: true },
      relations: ['sections', 'template'],
      order: {
        sections: {
          order: 'ASC',
        },
      },
    });
  }

  async updateCVData(id: string, userId: string, data: Partial<CVData>): Promise<CV> {
    const cv = await this.findById(id, userId);
    
    cv.data = {
      ...cv.data,
      ...data,
    };
    
    return this.cvRepository.save(cv);
  }

  async updateCVSettings(id: string, userId: string, settings: Partial<CVSettings>): Promise<CV> {
    const cv = await this.findById(id, userId);
    
    cv.settings = {
      ...cv.settings,
      ...settings,
    };
    
    return this.cvRepository.save(cv);
  }

  async getCVStatistics(userId: string): Promise<CVStatistics> {
    const cvs = await this.cvRepository.find({
      where: { user_id: userId },
      relations: ['template', 'sections'],
      order: { updated_at: 'DESC' },
    });

    const defaultCV = cvs.find(cv => cv.is_default);
    const lastUpdated = cvs.length > 0 ? cvs[0].updated_at : new Date();

    // Group by template
    const templateUsage = cvs.reduce((acc, cv) => {
      const templateId = cv.template_id;
      const templateName = cv.template?.name || 'Unknown';
      
      if (!acc[templateId]) {
        acc[templateId] = {
          template_id: templateId,
          template_name: templateName,
          count: 0,
        };
      }
      acc[templateId].count++;
      return acc;
    }, {} as Record<string, { template_id: string; template_name: string; count: number }>);

    // Calculate total sections and completeness
    const totalSections = cvs.reduce((acc, cv) => acc + (cv.sections?.length || 0), 0);
    const completeness = cvs.length > 0 ? Math.round(cvs.reduce((acc, cv) => {
      const sections = cv.sections?.length || 0;
      const filledSections = cv.sections?.filter(s => s.content && Object.keys(s.content).length > 0).length || 0;
      return acc + (sections > 0 ? (filledSections / sections) * 100 : 0);
    }, 0) / cvs.length) : 0;

    return {
      total_cvs: cvs.length,
      default_cv_id: defaultCV?.id,
      last_updated: lastUpdated,
      templates_used: Object.values(templateUsage).map(t => t.template_id),
      total_sections: totalSections,
      completeness: completeness,
    };
  }

  private async unsetDefaultCVs(userId: string, excludeId?: string): Promise<void> {
    const queryBuilder = this.cvRepository
      .createQueryBuilder()
      .update(CV)
      .set({ is_default: false })
      .where('user_id = :userId', { userId })
      .andWhere('is_default = true');

    if (excludeId) {
      queryBuilder.andWhere('id != :excludeId', { excludeId });
    }

    await queryBuilder.execute();
  }
}

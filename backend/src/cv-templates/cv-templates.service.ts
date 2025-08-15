import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CVTemplate } from '../cv/entities/cv-template.entity';
import { SectionType, TemplateSection, TemplateLayout } from '../types';
import {
  CreateCVTemplateDto,
  UpdateCVTemplateDto,
} from './dto/cv-template.dto';

@Injectable()
export class CVTemplatesService {
  constructor(
    @InjectRepository(CVTemplate)
    private readonly templateRepository: Repository<CVTemplate>,
  ) {}

  async findAll(): Promise<CVTemplate[]> {
    return this.templateRepository.find({
      where: { active: true },
      order: { created_at: 'ASC' },
    });
  }

  async findById(id: string): Promise<CVTemplate> {
    const template = await this.templateRepository.findOne({
      where: { id, active: true },
    });

    if (!template) {
      throw new NotFoundException(`CV Template with ID ${id} not found`);
    }

    return template;
  }

  async create(createTemplateDto: CreateCVTemplateDto): Promise<CVTemplate> {
    const template = this.templateRepository.create(createTemplateDto);
    return this.templateRepository.save(template);
  }

  async update(
    id: string,
    updateTemplateDto: UpdateCVTemplateDto,
  ): Promise<CVTemplate> {
    const template = await this.findById(id);

    Object.assign(template, updateTemplateDto);
    return this.templateRepository.save(template);
  }

  async delete(id: string): Promise<void> {
    const template = await this.findById(id);

    // Soft delete by setting active to false
    template.active = false;
    await this.templateRepository.save(template);
  }

  async seedDefaultTemplates(): Promise<void> {
    const existingTemplates = await this.templateRepository.count();

    if (existingTemplates === 0) {
      const defaultTemplates = this.getDefaultTemplates();

      for (const templateData of defaultTemplates) {
        const template = this.templateRepository.create(templateData);
        await this.templateRepository.save(template);
      }
    }
  }

  private getDefaultTemplates(): CreateCVTemplateDto[] {
    return [
      {
        name: 'Modern',
        description: 'A clean, modern CV template with a professional layout',
        structure: {
          layout: {
            type: 'two-column',
            sections: []
          } as TemplateLayout,
          sections: [
            {
              type: SectionType.HEADER,
              position: { order: 0 },
              required: true
            },
            {
              type: SectionType.SUMMARY,
              position: { order: 1 },
              required: false
            },
            {
              type: SectionType.EMPLOYMENT,
              position: { order: 2 },
              required: true
            },
            {
              type: SectionType.EDUCATION,
              position: { order: 3 },
              required: true
            },
            {
              type: SectionType.SKILLS,
              position: { order: 4 },
              required: false
            },
            {
              type: SectionType.CERTIFICATES,
              position: { order: 5 },
              required: false
            }
          ] as TemplateSection[]
        },
        styles: {
          colorScheme: {
            primary: '#2563eb',
            secondary: '#64748b',
            accent: '#0f172a',
            background: '#ffffff',
            text: '#1e293b',
            border: '#e5e7eb'
          },
          typography: {
            fontFamily: 'Inter, sans-serif',
            fontSize: {
              base: '14px',
              small: '12px',
              large: '16px',
              h1: '24px',
              h2: '20px',
              h3: '18px'
            },
            fontWeight: {
              normal: 400,
              medium: 500,
              bold: 700
            },
            lineHeight: {
              tight: 1.2,
              normal: 1.5,
              loose: 1.8
            }
          },
          spacing: {
            unit: '4px',
            small: '8px',
            medium: '16px',
            large: '24px',
            section: '32px',
            page: {
              top: '40px',
              right: '40px',
              bottom: '40px',
              left: '40px'
            }
          },
          layout: {
            columns: 2,
            width: '100%',
            maxWidth: '210mm'
          }
        },
        active: true,
      },
      {
        name: 'Classic',
        description:
          'A traditional CV template with a timeless, professional appearance',
        structure: {
          layout: {
            type: 'single-column',
            sections: []
          } as TemplateLayout,
          sections: [
            {
              type: SectionType.HEADER,
              position: { order: 0 },
              required: true
            },
            {
              type: SectionType.SUMMARY,
              position: { order: 1 },
              required: false
            },
            {
              type: SectionType.EMPLOYMENT,
              position: { order: 2 },
              required: true
            },
            {
              type: SectionType.EDUCATION,
              position: { order: 3 },
              required: true
            },
            {
              type: SectionType.SKILLS,
              position: { order: 4 },
              required: false
            },
            {
              type: SectionType.CERTIFICATES,
              position: { order: 5 },
              required: false
            },
            {
              type: SectionType.AWARDS,
              position: { order: 6 },
              required: false
            }
          ] as TemplateSection[]
        },
        styles: {
          colorScheme: {
            primary: '#000000',
            secondary: '#666666',
            accent: '#000000',
            background: '#ffffff',
            text: '#000000',
            border: '#cccccc'
          },
          typography: {
            fontFamily: 'Times New Roman, serif',
            fontSize: {
              base: '12px',
              small: '10px',
              large: '14px',
              h1: '22px',
              h2: '18px',
              h3: '16px'
            },
            fontWeight: {
              normal: 400,
              medium: 500,
              bold: 700
            },
            lineHeight: {
              tight: 1.2,
              normal: 1.5,
              loose: 1.8
            }
          },
          spacing: {
            unit: '4px',
            small: '8px',
            medium: '12px',
            large: '20px',
            section: '24px',
            page: {
              top: '40px',
              right: '40px',
              bottom: '40px',
              left: '40px'
            }
          },
          layout: {
            columns: 1,
            width: '100%',
            maxWidth: '210mm'
          }
        },
        active: true,
      },
    ];
  }
}

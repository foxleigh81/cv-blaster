import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CV } from '../entities/cv.entity';
import { CVSection } from '../entities/cv-section.entity';
import { 
  CreateCustomSectionDto, 
  UpdateSectionDto, 
  ReorderSectionsDto,
  BulkUpdateSectionsDto,
} from '../dto/cv-section.dto';

@Injectable()
export class CVEditorService {
  constructor(
    @InjectRepository(CV)
    private readonly cvRepository: Repository<CV>,
    @InjectRepository(CVSection)
    private readonly sectionRepository: Repository<CVSection>,
  ) {}

  async addCustomSection(
    cvId: string, 
    userId: string, 
    createSectionDto: CreateCustomSectionDto
  ): Promise<CVSection> {
    // Verify CV ownership
    const cv = await this.verifyCVOwnership(cvId, userId);

    // Determine order position
    let order = createSectionDto.order;
    if (order === undefined) {
      const maxOrder = await this.sectionRepository
        .createQueryBuilder('section')
        .select('MAX(section.order)', 'max')
        .where('section.cv_id = :cvId', { cvId })
        .getRawOne();
      
      order = (maxOrder?.max || 0) + 1;
    } else {
      // Shift existing sections if inserting at specific position
      await this.shiftSectionsOrder(cvId, order, 1);
    }

    const section = this.sectionRepository.create({
      cv_id: cvId,
      section_type: 'custom',
      title: createSectionDto.title,
      content: createSectionDto.content,
      order,
      visible: createSectionDto.visible ?? true,
    });

    return this.sectionRepository.save(section);
  }

  async updateSection(
    cvId: string,
    sectionId: string,
    userId: string,
    updateDto: UpdateSectionDto
  ): Promise<CVSection> {
    // Verify CV ownership
    await this.verifyCVOwnership(cvId, userId);

    const section = await this.sectionRepository.findOne({
      where: { id: sectionId, cv_id: cvId },
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    Object.assign(section, updateDto);
    return this.sectionRepository.save(section);
  }

  async deleteSection(
    cvId: string,
    sectionId: string,
    userId: string
  ): Promise<void> {
    // Verify CV ownership
    await this.verifyCVOwnership(cvId, userId);

    const section = await this.sectionRepository.findOne({
      where: { id: sectionId, cv_id: cvId },
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    // Prevent deletion of required sections
    if (this.isRequiredSection(section.section_type)) {
      throw new BadRequestException('Cannot delete required sections');
    }

    const sectionOrder = section.order;
    
    // Delete the section
    await this.sectionRepository.remove(section);

    // Shift remaining sections up
    await this.shiftSectionsOrder(cvId, sectionOrder + 1, -1);
  }

  async reorderSections(
    cvId: string,
    userId: string,
    reorderDto: ReorderSectionsDto
  ): Promise<CVSection[]> {
    // Verify CV ownership
    await this.verifyCVOwnership(cvId, userId);

    // Get all sections for this CV
    const sections = await this.sectionRepository.find({
      where: { cv_id: cvId },
    });

    // Validate that all section IDs exist and belong to this CV
    const sectionIds = sections.map(s => s.id);
    const providedIds = reorderDto.section_ids;

    if (providedIds.length !== sectionIds.length) {
      throw new BadRequestException('Must include all section IDs');
    }

    for (const id of providedIds) {
      if (!sectionIds.includes(id)) {
        throw new BadRequestException(`Section ID ${id} not found in CV`);
      }
    }

    // Update section orders
    const updates = providedIds.map((id, index) => ({
      id,
      order: index,
    }));

    for (const update of updates) {
      await this.sectionRepository.update(
        { id: update.id, cv_id: cvId },
        { order: update.order }
      );
    }

    // Return updated sections in new order
    return this.sectionRepository.find({
      where: { cv_id: cvId },
      order: { order: 'ASC' },
    });
  }

  async updateSectionVisibility(
    cvId: string,
    sectionId: string,
    userId: string,
    visible: boolean
  ): Promise<CVSection> {
    // Verify CV ownership
    await this.verifyCVOwnership(cvId, userId);

    const section = await this.sectionRepository.findOne({
      where: { id: sectionId, cv_id: cvId },
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    // Prevent hiding required sections
    if (!visible && this.isRequiredSection(section.section_type)) {
      throw new BadRequestException('Cannot hide required sections');
    }

    section.visible = visible;
    return this.sectionRepository.save(section);
  }

  async bulkUpdateSections(
    cvId: string,
    userId: string,
    bulkUpdateDto: BulkUpdateSectionsDto
  ): Promise<CVSection[]> {
    // Verify CV ownership
    await this.verifyCVOwnership(cvId, userId);

    const updatedSections: CVSection[] = [];

    for (const sectionUpdate of bulkUpdateDto.sections) {
      const section = await this.sectionRepository.findOne({
        where: { id: sectionUpdate.id, cv_id: cvId },
      });

      if (!section) {
        throw new NotFoundException(`Section with ID ${sectionUpdate.id} not found`);
      }

      // Apply updates
      if (sectionUpdate.title !== undefined) {
        section.title = sectionUpdate.title;
      }
      if (sectionUpdate.content !== undefined) {
        section.content = sectionUpdate.content;
      }
      if (sectionUpdate.visible !== undefined) {
        // Check if we're trying to hide a required section
        if (!sectionUpdate.visible && this.isRequiredSection(section.section_type)) {
          throw new BadRequestException(`Cannot hide required section: ${section.section_type}`);
        }
        section.visible = sectionUpdate.visible;
      }
      if (sectionUpdate.order !== undefined) {
        section.order = sectionUpdate.order;
      }

      const updatedSection = await this.sectionRepository.save(section);
      updatedSections.push(updatedSection);
    }

    return updatedSections;
  }

  async duplicateSection(
    cvId: string,
    sectionId: string,
    userId: string,
    newTitle?: string
  ): Promise<CVSection> {
    // Verify CV ownership
    await this.verifyCVOwnership(cvId, userId);

    const originalSection = await this.sectionRepository.findOne({
      where: { id: sectionId, cv_id: cvId },
    });

    if (!originalSection) {
      throw new NotFoundException('Section not found');
    }

    // Get next order position
    const maxOrder = await this.sectionRepository
      .createQueryBuilder('section')
      .select('MAX(section.order)', 'max')
      .where('section.cv_id = :cvId', { cvId })
      .getRawOne();

    const newSection = this.sectionRepository.create({
      cv_id: cvId,
      section_type: originalSection.section_type,
      title: newTitle || `${originalSection.title} (Copy)`,
      content: { ...originalSection.content },
      order: (maxOrder?.max || 0) + 1,
      visible: originalSection.visible,
    });

    return this.sectionRepository.save(newSection);
  }

  async getSectionsByType(
    cvId: string,
    userId: string,
    sectionType: string
  ): Promise<CVSection[]> {
    // Verify CV ownership
    await this.verifyCVOwnership(cvId, userId);

    return this.sectionRepository.find({
      where: { cv_id: cvId, section_type: sectionType },
      order: { order: 'ASC' },
    });
  }

  async resetSectionOrder(cvId: string, userId: string): Promise<CVSection[]> {
    // Verify CV ownership
    await this.verifyCVOwnership(cvId, userId);

    const sections = await this.sectionRepository.find({
      where: { cv_id: cvId },
      order: { created_at: 'ASC' },
    });

    // Reset order based on creation time and section type priority
    const sectionPriority = {
      'header': 0,
      'summary': 1,
      'employment': 2,
      'education': 3,
      'skills': 4,
      'certificates': 5,
      'awards': 6,
      'custom': 7,
    };

    sections.sort((a, b) => {
      const priorityA = sectionPriority[a.section_type as keyof typeof sectionPriority] ?? 999;
      const priorityB = sectionPriority[b.section_type as keyof typeof sectionPriority] ?? 999;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    // Update orders
    for (let i = 0; i < sections.length; i++) {
      sections[i].order = i;
      await this.sectionRepository.save(sections[i]);
    }

    return sections;
  }

  private async verifyCVOwnership(cvId: string, userId: string): Promise<CV> {
    const cv = await this.cvRepository.findOne({
      where: { id: cvId, user_id: userId },
    });

    if (!cv) {
      throw new NotFoundException('CV not found');
    }

    return cv;
  }

  private async shiftSectionsOrder(
    cvId: string,
    fromOrder: number,
    shift: number
  ): Promise<void> {
    if (shift > 0) {
      // Shifting up (making room for insertion)
      await this.sectionRepository
        .createQueryBuilder()
        .update(CVSection)
        .set({ order: () => `"order" + ${shift}` })
        .where('cv_id = :cvId', { cvId })
        .andWhere('"order" >= :fromOrder', { fromOrder })
        .execute();
    } else if (shift < 0) {
      // Shifting down (closing gap from deletion)
      await this.sectionRepository
        .createQueryBuilder()
        .update(CVSection)
        .set({ order: () => `"order" ${shift}` })
        .where('cv_id = :cvId', { cvId })
        .andWhere('"order" >= :fromOrder', { fromOrder })
        .execute();
    }
  }

  private isRequiredSection(sectionType: string): boolean {
    const requiredSections = ['header', 'employment', 'education'];
    return requiredSections.includes(sectionType);
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CV } from '../entities/cv.entity';
import { CVSection } from '../entities/cv-section.entity';
import { CVTemplate } from '../entities/cv-template.entity';
import { User } from '../../users/entities/user.entity';
import { Profile } from '../../users/entities/profile.entity';
import { Employment } from '../../profile/entities/employment.entity';
import { Education } from '../../profile/entities/education.entity';
import { UserSkill } from '../../profile/entities/user-skill.entity';
import { Certificate } from '../../profile/entities/certificate.entity';
import { Award } from '../../profile/entities/award.entity';
import { TemplateEngineService, TemplateRenderContext } from '../../cv-templates/services/template-engine.service';
import { CreateCVFromProfileDto } from '../dto/cv.dto';

@Injectable()
export class CVBuilderService {
  constructor(
    @InjectRepository(CV)
    private readonly cvRepository: Repository<CV>,
    @InjectRepository(CVSection)
    private readonly sectionRepository: Repository<CVSection>,
    @InjectRepository(CVTemplate)
    private readonly templateRepository: Repository<CVTemplate>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Employment)
    private readonly employmentRepository: Repository<Employment>,
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
    @InjectRepository(UserSkill)
    private readonly userSkillRepository: Repository<UserSkill>,
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    @InjectRepository(Award)
    private readonly awardRepository: Repository<Award>,
    private readonly templateEngineService: TemplateEngineService,
  ) {}

  async buildCVFromProfile(
    userId: string,
    createCVDto: CreateCVFromProfileDto,
  ): Promise<CV> {
    // Get user and profile data
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profile = await this.profileRepository.findOne({
      where: { user_id: userId },
    });

    // Get template
    const template = await this.templateRepository.findOne({
      where: { id: createCVDto.template_id, active: true },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Gather profile data based on inclusion flags
    const renderContext = await this.buildRenderContext(userId, createCVDto);

    // Render CV using template engine
    const renderedCV = await this.templateEngineService.renderCV(template, renderContext);

    // Create CV entity
    const cv = this.cvRepository.create({
      user_id: userId,
      template_id: createCVDto.template_id,
      name: createCVDto.name,
      data: {
        personal: renderContext.user,
        summary: renderContext.profile?.bio ? { bio: renderContext.profile.bio } : undefined,
        sections: {
          ...(createCVDto.include_employment && { employment: renderContext.employment }),
          ...(createCVDto.include_education && { education: renderContext.education }),
          ...(createCVDto.include_skills && { skills: renderContext.skills }),
          ...(createCVDto.include_certificates && { certificates: renderContext.certificates }),
          ...(createCVDto.include_awards && { awards: renderContext.awards }),
          ...(createCVDto.custom_sections && { customSections: createCVDto.custom_sections }),
        }
      },
      settings: renderedCV.styles as any,
      is_default: false,
    });

    const savedCV = await this.cvRepository.save(cv) as CV;

    // Create sections
    const sections = renderedCV.sections.map((section, index) => 
      this.sectionRepository.create({
        cv_id: savedCV.id,
        section_type: section.type,
        title: section.title,
        content: section.content,
        order: index,
        visible: section.visible,
      })
    );

    await this.sectionRepository.save(sections);

    // Return CV with sections
    const cvResult = await this.cvRepository.findOne({
      where: { id: savedCV.id },
      relations: ['sections', 'template'],
    });
    
    if (!cvResult) {
      throw new NotFoundException('Failed to load created CV');
    }
    return cvResult;
  }

  async duplicateCV(originalCVId: string, userId: string, newName: string, newTemplateId?: string): Promise<CV> {
    // Get original CV
    const originalCV = await this.cvRepository.findOne({
      where: { id: originalCVId, user_id: userId },
      relations: ['sections'],
    });

    if (!originalCV) {
      throw new NotFoundException('CV not found');
    }

    // If new template is specified, validate it
    let template: CVTemplate | null = null;
    if (newTemplateId) {
      template = await this.templateRepository.findOne({
        where: { id: newTemplateId, active: true },
      });
      if (!template) {
        throw new NotFoundException('New template not found');
      }
    }

    // Create new CV
    const duplicatedCV = this.cvRepository.create({
      user_id: userId,
      template_id: newTemplateId || originalCV.template_id,
      name: newName,
      data: originalCV.data,
      settings: originalCV.settings,
      is_default: false,
    });

    const savedCV = await this.cvRepository.save(duplicatedCV) as CV;

    // Duplicate sections
    const newSections = originalCV.sections.map(section =>
      this.sectionRepository.create({
        cv_id: savedCV.id,
        section_type: section.section_type,
        title: section.title,
        content: section.content,
        order: section.order,
        visible: section.visible,
      })
    );

    await this.sectionRepository.save(newSections);

    const cv = await this.cvRepository.findOne({
      where: { id: savedCV.id },
      relations: ['sections', 'template'],
    });

    if (!cv) {
      throw new NotFoundException('Failed to load duplicated CV');
    }
    return cv;

  }

  async rebuildCVFromProfile(cvId: string, userId: string): Promise<CV> {
    // Get existing CV
    const cv = await this.cvRepository.findOne({
      where: { id: cvId, user_id: userId },
      relations: ['template'],
    });

    if (!cv) {
      throw new NotFoundException('CV not found');
    }

    // Build render context with current profile data
    const renderContext = await this.buildRenderContext(userId, {
      name: cv.name,
      template_id: cv.template_id,
      include_employment: true,
      include_education: true,
      include_skills: true,
      include_certificates: true,
      include_awards: true,
    });

    // Render CV using template engine
    const renderedCV = await this.templateEngineService.renderCV(cv.template, renderContext);

    // Update CV data
    cv.data = {
      personal: renderContext.user,
      summary: renderContext.profile?.bio ? { bio: renderContext.profile.bio } : undefined,
      sections: {
        employment: renderContext.employment as any,
        education: renderContext.education as any,
        skills: renderContext.skills as any,
        certificates: renderContext.certificates as any,
        awards: renderContext.awards as any,
      }
    };

    await this.cvRepository.save(cv);

    // Remove existing sections and create new ones
    await this.sectionRepository.delete({ cv_id: cvId });

    const sections = renderedCV.sections.map((section, index) => 
      this.sectionRepository.create({
        cv_id: cvId,
        section_type: section.type,
        title: section.title,
        content: section.content,
        order: index,
        visible: section.visible,
      })
    );

    await this.sectionRepository.save(sections);

    const cvResult = await this.cvRepository.findOne({
      where: { id: cvId },
      relations: ['sections', 'template'],
    });

    if (!cvResult) {
      throw new NotFoundException('Failed to load rebuilt CV');
    }
    return cvResult;
  }

  private async buildRenderContext(
    userId: string,
    options: CreateCVFromProfileDto,
  ): Promise<TemplateRenderContext> {
    // Get user data
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profile = await this.profileRepository.findOne({
      where: { user_id: userId },
    });

    // Build context
    const context: TemplateRenderContext = {
      user: {
        name: user.name,
        email: user.email,
        phone: profile?.phone,
        location: profile?.location,
        website: profile?.website,
        linkedin: profile?.linkedin,
        github: profile?.github,
      },
      profile: {
        bio: profile?.bio,
      },
      employment: [],
      education: [],
      skills: [],
      certificates: [],
      awards: [],
    };

    // Load employment history
    if (options.include_employment) {
      const employment = await this.employmentRepository.find({
        where: { user_id: userId },
        order: { start_date: 'DESC' },
      });

      context.employment = employment.map(job => ({
        company: job.company,
        position: job.position,
        start_date: job.start_date.toISOString(),
        end_date: job.end_date?.toISOString(),
        current: job.current,
        description: job.description || undefined,
        achievements: Array.isArray(job.achievements) ? job.achievements.map(a => typeof a === 'string' ? a : a.description) : [],
      }));
    }

    // Load education
    if (options.include_education) {
      const education = await this.educationRepository.find({
        where: { user_id: userId },
        order: { graduation_date: 'DESC' },
      });

      context.education = education.map(edu => ({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        graduation_date: edu.graduation_date?.toISOString(),
        gpa: edu.gpa,
      }));
    }

    // Load skills
    if (options.include_skills) {
      const userSkills = await this.userSkillRepository.find({
        where: { user_id: userId },
        relations: ['skill'],
      });

      context.skills = userSkills.map(userSkill => ({
        name: userSkill.skill.name,
        category: userSkill.skill.category,
        proficiency: userSkill.proficiency,
        years: userSkill.years,
      }));
    }

    // Load certificates
    if (options.include_certificates) {
      const certificates = await this.certificateRepository.find({
        where: { user_id: userId },
        order: { issue_date: 'DESC' },
      });

      context.certificates = certificates.map(cert => ({
        name: cert.name,
        issuer: cert.issuer,
        issue_date: cert.issue_date?.toISOString(),
        expiry_date: cert.expiry_date?.toISOString(),
        credential_id: cert.credential_id,
      }));
    }

    // Load awards
    if (options.include_awards) {
      const awards = await this.awardRepository.find({
        where: { user_id: userId },
        order: { date_received: 'DESC' },
      });

      context.awards = awards.map(award => ({
        name: award.title,
        issuer: award.issuer,
        date: award.date_received?.toISOString(),
        description: award.description,
      }));
    }

    // Add custom sections if provided
    if (options.custom_sections) {
      context.customSections = options.custom_sections;
    }

    return context;
  }
}
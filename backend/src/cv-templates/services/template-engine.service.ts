import { Injectable } from '@nestjs/common';
import { CVTemplate } from '../../cv/entities/cv-template.entity';
import {
  Employment,
  Education,
  Certificate,
  Award,
  UserSkill,
  TemplateStructure,
  TemplateSection,
  TemplateStyles,
  TemplateValidationResult,
  SectionContent,
  HeaderContent,
  SummaryContent,
  SkillsContent,
  CustomSectionContent,
} from '../../types';

export interface TemplateRenderContext {
  user: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  profile: {
    bio?: string;
  };
  employment: Array<{
    company: string;
    position: string;
    start_date: string;
    end_date?: string;
    current: boolean;
    description?: string;
    achievements?: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field?: string;
    graduation_date?: string;
    gpa?: number;
  }>;
  skills: Array<{
    name: string;
    category?: string;
    proficiency?: number;
    years?: number;
  }>;
  certificates: Array<{
    name: string;
    issuer: string;
    issue_date?: string;
    expiry_date?: string;
    credential_id?: string;
  }>;
  awards: Array<{
    name: string;
    issuer: string;
    date?: string;
    description?: string;
  }>;
  customSections?: Array<{
    title: string;
    content: CustomSectionContent;
  }>;
}

export interface RenderedSection {
  type: string;
  title: string;
  content: SectionContent;
  order: number;
  visible: boolean;
}

export interface RenderedCV {
  sections: RenderedSection[];
  styles: TemplateStyles;
  metadata: {
    templateId: string;
    templateName: string;
    generatedAt: Date;
  };
}

@Injectable()
export class TemplateEngineService {
  /**
   * Renders a CV using the provided template and data context
   */
  async renderCV(
    template: CVTemplate,
    context: TemplateRenderContext,
  ): Promise<RenderedCV> {
    const sections = await this.buildSections(template, context);

    return {
      sections,
      styles: template.styles || ({} as TemplateStyles),
      metadata: {
        templateId: template.id,
        templateName: template.name,
        generatedAt: new Date(),
      },
    };
  }

  /**
   * Validates if a template structure is valid
   */
  validateTemplateStructure(structure: TemplateStructure): TemplateValidationResult {
    const errors: string[] = [];

    if (!structure.layout) {
      errors.push('Template structure must include a layout property');
    }

    if (!structure.sections || !Array.isArray(structure.sections)) {
      errors.push('Template structure must include a sections array');
    } else {
      // Validate each section
      structure.sections.forEach((section: TemplateSection, index: number) => {
        if (!section.type) {
          errors.push(`Section ${index} must have a type`);
        }
        if (!section.position) {
          errors.push(`Section ${index} must have a position`);
        }
        if (typeof section.required !== 'boolean') {
          errors.push(`Section ${index} must have a required boolean property`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Gets the default section order for a template
   */
  getDefaultSectionOrder(template: CVTemplate): string[] {
    const sections = template.structure?.sections || [];
    return sections
      .sort((a: TemplateSection, b: TemplateSection) => {
        const order = [
          'header',
          'summary',
          'employment',
          'education',
          'skills',
          'certificates',
          'awards',
        ];
        return order.indexOf(a.type) - order.indexOf(b.type);
      })
      .map((section: TemplateSection) => section.type);
  }

  /**
   * Applies custom styling to a template
   */
  applyCustomStyles(baseStyles: TemplateStyles, customStyles: Partial<TemplateStyles>): TemplateStyles {
    return {
      ...baseStyles,
      ...customStyles,
      colorScheme: {
        ...baseStyles?.colorScheme,
        ...customStyles?.colorScheme,
      },
      typography: {
        ...baseStyles?.typography,
        ...customStyles?.typography,
      },
      spacing: {
        ...baseStyles?.spacing,
        ...customStyles?.spacing,
      },
      layout: {
        ...baseStyles?.layout,
        ...customStyles?.layout,
      },
    } as TemplateStyles;
  }

  private async buildSections(
    template: CVTemplate,
    context: TemplateRenderContext,
  ): Promise<RenderedSection[]> {
    const templateSections = template.structure?.sections || [];
    const sections: RenderedSection[] = [];

    for (let i = 0; i < templateSections.length; i++) {
      const sectionDef = templateSections[i];
      const sectionContent = this.buildSectionContent(sectionDef.type, context);

      // Skip empty optional sections
      if (!sectionDef.required && this.isSectionEmpty(sectionContent)) {
        continue;
      }

      sections.push({
        type: sectionDef.type,
        title: this.getSectionTitle(sectionDef.type),
        content: sectionContent,
        order: i,
        visible: true,
      });
    }

    return sections;
  }

  private buildSectionContent(
    sectionType: string,
    context: TemplateRenderContext,
  ): SectionContent {
    switch (sectionType) {
      case 'header':
        return {
          name: context.user.name,
          email: context.user.email,
          phone: context.user.phone,
          location: context.user.location,
          website: context.user.website,
          linkedin: context.user.linkedin,
          github: context.user.github,
        } as HeaderContent;

      case 'summary':
        return {
          bio: context.profile.bio,
        } as SummaryContent;

      case 'employment':
        return context.employment.map((job) => ({
          ...job,
          user_id: '', // Will be set by the service
          id: '', // Will be set by the service
          created_at: new Date(),
          updated_at: new Date(),
          dateRange: this.formatDateRange(
            job.start_date,
            job.end_date,
            job.current,
          ),
        })) as Employment[];

      case 'education':
        return context.education.map((edu) => ({
          ...edu,
          user_id: '', // Will be set by the service
          id: '', // Will be set by the service
          created_at: new Date(),
          updated_at: new Date(),
          displayName: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`,
        })) as Education[];

      case 'skills':
        return this.groupSkillsByCategory(context.skills);

      case 'certificates':
        return context.certificates as Certificate[];

      case 'awards':
        return context.awards as Award[];

      default:
        return {} as CustomSectionContent;
    }
  }

  private isSectionEmpty(content: SectionContent): boolean {
    if (!content) return true;
    if (Array.isArray(content)) return content.length === 0;
    if (typeof content === 'object') {
      return Object.values(content).every(
        (value) => value === null || value === undefined || value === '',
      );
    }
    return false;
  }

  private getSectionTitle(sectionType: string): string {
    const titleMap: Record<string, string> = {
      header: 'Personal Information',
      summary: 'Professional Summary',
      employment: 'Work Experience',
      education: 'Education',
      skills: 'Skills',
      certificates: 'Certifications',
      awards: 'Awards & Recognition',
    };

    return (
      titleMap[sectionType] ||
      sectionType.charAt(0).toUpperCase() + sectionType.slice(1)
    );
  }

  private formatDateRange(
    startDate: string,
    endDate?: string,
    current?: boolean,
  ): string {
    const start = new Date(startDate).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

    if (current) {
      return `${start} - Present`;
    }

    if (endDate) {
      const end = new Date(endDate).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      return `${start} - ${end}`;
    }

    return start;
  }

  private groupSkillsByCategory(skills: Array<{
    name: string;
    category?: string;
    proficiency?: number;
    years?: number;
  }>): SkillsContent {
    const grouped = skills.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        name: skill.name,
        proficiency: skill.proficiency,
        years: skill.years,
      });
      return acc;
    }, {} as Record<string, Array<{ name: string; proficiency?: number; years?: number }>>);

    return {
      categories: Object.entries(grouped).map(([category, skills]) => ({
        category,
        skills,
      })),
    };
  }
}

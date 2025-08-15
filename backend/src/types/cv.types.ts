/**
 * CV related types
 */

import { BaseEntityFields } from './common.types';
import { TemplateCustomization, SectionType } from './template.types';
import {
  Employment,
  Education,
  UserSkill,
  Certificate,
  Award,
  Language,
  Project,
  Publication,
  Volunteer,
} from './profile.types';

/**
 * CV section content types
 */
export type SectionContent =
  | HeaderContent
  | SummaryContent
  | Employment[]
  | Education[]
  | SkillsContent
  | Certificate[]
  | Award[]
  | Language[]
  | Project[]
  | Publication[]
  | Volunteer[]
  | CustomSectionContent;

/**
 * Header section content
 */
export interface HeaderContent {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  portfolio?: string;
}

/**
 * Summary section content
 */
export interface SummaryContent {
  bio?: string;
  headline?: string;
  objective?: string;
  highlights?: string[];
}

/**
 * Skills section content
 */
export interface SkillsContent {
  categories?: Array<{
    category: string;
    skills: Array<{
      name: string;
      proficiency?: number;
      years?: number;
    }>;
  }>;
  skills?: Array<{
    name: string;
    proficiency?: number;
    years?: number;
  }>;
}

/**
 * Custom section content
 */
export interface CustomSectionContent {
  type: 'text' | 'list' | 'grid' | 'timeline' | 'raw';
  data: unknown;
}

/**
 * CV section entity
 */
export interface CVSection extends BaseEntityFields {
  cv_id: string;
  section_type: SectionType | string;
  title: string;
  content: SectionContent;
  order: number;
  visible: boolean;
  custom_styles?: Record<string, string>;
}

/**
 * CV data structure
 */
export interface CVData {
  personal?: HeaderContent;
  summary?: SummaryContent;
  sections?: {
    [key: string]: SectionContent;
  };
  metadata?: {
    version?: string;
    lastModified?: Date;
    tags?: string[];
    keywords?: string[];
  };
}

/**
 * CV settings
 */
export interface CVSettings {
  customization?: TemplateCustomization;
  visibility?: {
    [key: string]: boolean;
  };
  sectionOrder?: string[];
  pageSettings?: {
    size?: 'A4' | 'Letter' | 'Legal';
    orientation?: 'portrait' | 'landscape';
    margins?: {
      top: string;
      right: string;
      bottom: string;
      left: string;
    };
  };
  language?: string;
  autoSave?: boolean;
  collaborators?: string[];
}

/**
 * CV entity
 */
export interface CV extends BaseEntityFields {
  user_id: string;
  template_id: string;
  name: string;
  data?: CVData;
  settings?: CVSettings;
  is_default: boolean;
  sections?: CVSection[];
  tags?: string[];
  shared?: boolean;
  share_url?: string;
  version?: number;
  parent_id?: string; // For tracking duplicated CVs
}

/**
 * CV statistics
 */
export interface CVStatistics {
  total_cvs: number;
  default_cv_id?: string;
  templates_used: string[];
  last_updated?: Date;
  total_sections: number;
  completeness: number;
  most_used_template?: {
    id: string;
    name: string;
    count: number;
  };
}

/**
 * CV list item for dashboard
 */
export interface CVListItem {
  id: string;
  name: string;
  template_name: string;
  is_default: boolean;
  updated_at: Date;
  sections_count: number;
  completeness?: number;
  shared?: boolean;
  tags?: string[];
}

/**
 * CV creation from profile options
 */
export interface CreateCVFromProfileOptions {
  name: string;
  template_id: string;
  include_employment?: boolean;
  include_education?: boolean;
  include_skills?: boolean;
  include_certificates?: boolean;
  include_awards?: boolean;
  include_languages?: boolean;
  include_projects?: boolean;
  include_publications?: boolean;
  include_volunteer?: boolean;
  employment_limit?: number;
  education_limit?: number;
  date_range?: {
    start?: Date;
    end?: Date;
  };
  custom_sections?: Array<{
    title: string;
    content: CustomSectionContent;
  }>;
}

/**
 * CV duplication options
 */
export interface DuplicateCVOptions {
  name: string;
  template_id?: string;
  include_settings?: boolean;
  include_customization?: boolean;
  make_default?: boolean;
}

/**
 * CV update payload
 */
export interface CVUpdate {
  name?: string;
  template_id?: string;
  data?: Partial<CVData>;
  settings?: Partial<CVSettings>;
  is_default?: boolean;
}

/**
 * CV section update
 */
export interface CVSectionUpdate {
  title?: string;
  content?: SectionContent;
  order?: number;
  visible?: boolean;
}

/**
 * CV export result
 */
export interface CVExportResult {
  format: string;
  filename: string;
  content: Buffer | string;
  mimeType: string;
  size: number;
}

/**
 * CV validation result
 */
export interface CVValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
  suggestions?: string[];
  completeness: number;
}

/**
 * CV share settings
 */
export interface CVShareSettings {
  public: boolean;
  password?: string;
  expiry?: Date;
  allow_download?: boolean;
  watermark?: boolean;
  analytics?: boolean;
}

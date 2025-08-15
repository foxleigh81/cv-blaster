/**
 * CV Template related types
 */

import { BaseEntityFields, ColorScheme, Typography, Spacing, Layout } from './common.types';

/**
 * Template section types
 */
export enum SectionType {
  HEADER = 'header',
  SUMMARY = 'summary',
  EMPLOYMENT = 'employment',
  EDUCATION = 'education',
  SKILLS = 'skills',
  CERTIFICATES = 'certificates',
  AWARDS = 'awards',
  LANGUAGES = 'languages',
  PROJECTS = 'projects',
  PUBLICATIONS = 'publications',
  VOLUNTEER = 'volunteer',
  CUSTOM = 'custom',
}

/**
 * Template section position
 */
export interface SectionPosition {
  column?: number;
  order: number;
  width?: 'full' | 'half' | 'third' | 'two-thirds';
}

/**
 * Template section configuration
 */
export interface TemplateSection {
  type: SectionType;
  title?: string;
  position: SectionPosition;
  required: boolean;
  visible?: boolean;
  customizable?: boolean;
  maxItems?: number;
  minItems?: number;
  config?: {
    showDates?: boolean;
    showDescriptions?: boolean;
    showIcons?: boolean;
    bulletPoints?: boolean;
    columns?: number;
    dateFormat?: string;
  };
}

/**
 * Template layout configuration
 */
export interface TemplateLayout {
  type: 'single-column' | 'two-column' | 'three-column' | 'asymmetric';
  header?: 'standard' | 'minimal' | 'creative' | 'professional';
  sections: TemplateSection[];
  pageBreaks?: string[]; // Section types after which to break page
}

/**
 * Template structure
 */
export interface TemplateStructure {
  layout: TemplateLayout;
  sections: TemplateSection[];
  metadata?: {
    version: string;
    author?: string;
    category?: string;
    tags?: string[];
  };
}

/**
 * Template styles
 */
export interface TemplateStyles {
  colorScheme: ColorScheme;
  typography: Typography;
  spacing: Spacing;
  layout: Layout;
  borders?: {
    style: string;
    width: string;
    radius: string;
  };
  shadows?: {
    small: string;
    medium: string;
    large: string;
  };
  customCSS?: string;
}

/**
 * CV Template entity
 */
export interface CVTemplate extends BaseEntityFields {
  name: string;
  description?: string;
  structure: TemplateStructure;
  styles?: TemplateStyles;
  active: boolean;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  premium?: boolean;
  usage_count?: number;
  rating?: number;
}

/**
 * Template validation result
 */
export interface TemplateValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Template preview data
 */
export interface TemplatePreview {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  premium?: boolean;
  rating?: number;
  usage_count?: number;
}

/**
 * Template customization options
 */
export interface TemplateCustomization {
  colorScheme?: Partial<ColorScheme>;
  typography?: Partial<Typography>;
  spacing?: Partial<Spacing>;
  sectionOrder?: string[];
  hiddenSections?: string[];
  customSections?: Array<{
    title: string;
    type: 'custom';
    content: unknown;
  }>;
}

/**
 * Template export format
 */
export enum ExportFormat {
  PDF = 'pdf',
  DOCX = 'docx',
  HTML = 'html',
  JSON = 'json',
  MARKDOWN = 'markdown',
}

/**
 * Template export options
 */
export interface ExportOptions {
  format: ExportFormat;
  includeStyles?: boolean;
  pageSize?: 'A4' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  watermark?: string;
  password?: string;
}

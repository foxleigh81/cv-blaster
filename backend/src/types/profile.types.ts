/**
 * Profile data types for employment, education, skills, etc.
 */

import { BaseEntityFields } from './common.types';

/**
 * Employment achievement structure
 */
export interface EmploymentAchievement {
  description: string;
  impact?: string;
  metrics?: string;
}

/**
 * Employment data structure
 */
export interface Employment extends BaseEntityFields {
  user_id: string;
  company: string;
  position: string;
  start_date: Date | string;
  end_date?: Date | string;
  current: boolean;
  description?: string;
  achievements?: EmploymentAchievement[];
  location?: string;
  employment_type?: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  remote?: boolean;
  technologies?: string[];
  responsibilities?: string[];
}

/**
 * Education data structure
 */
export interface Education extends BaseEntityFields {
  user_id: string;
  institution: string;
  degree: string;
  field?: string;
  start_date?: Date | string;
  graduation_date?: Date | string;
  gpa?: number;
  max_gpa?: number;
  honors?: string[];
  coursework?: string[];
  activities?: string[];
  thesis?: string;
}

/**
 * Skill proficiency levels
 */
export enum SkillProficiency {
  BEGINNER = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3,
  EXPERT = 4,
  MASTER = 5,
}

/**
 * Skill data structure
 */
export interface Skill extends BaseEntityFields {
  name: string;
  category?: string;
  description?: string;
  keywords?: string[];
}

/**
 * User skill association with proficiency
 */
export interface UserSkill extends BaseEntityFields {
  user_id: string;
  skill_id: string;
  skill?: Skill;
  proficiency?: SkillProficiency;
  years_experience?: number;
  last_used?: Date | string;
  endorsed_by?: number;
  verified?: boolean;
}

/**
 * Certificate data structure
 */
export interface Certificate extends BaseEntityFields {
  user_id: string;
  name: string;
  issuer: string;
  issue_date?: Date | string;
  expiry_date?: Date | string;
  credential_id?: string;
  credential_url?: string;
  description?: string;
  skills?: string[];
}

/**
 * Award data structure
 */
export interface Award extends BaseEntityFields {
  user_id: string;
  name: string;
  issuer: string;
  date?: Date | string;
  description?: string;
  url?: string;
  category?: string;
}

/**
 * Language proficiency levels
 */
export enum LanguageProficiency {
  BASIC = 'basic',
  CONVERSATIONAL = 'conversational',
  PROFICIENT = 'proficient',
  FLUENT = 'fluent',
  NATIVE = 'native',
}

/**
 * Language skill
 */
export interface Language {
  name: string;
  proficiency: LanguageProficiency;
  certified?: boolean;
  certification?: string;
}

/**
 * Project data structure
 */
export interface Project extends BaseEntityFields {
  user_id: string;
  name: string;
  description: string;
  role?: string;
  start_date?: Date | string;
  end_date?: Date | string;
  current?: boolean;
  url?: string;
  repository?: string;
  technologies?: string[];
  highlights?: string[];
  team_size?: number;
}

/**
 * Publication data structure
 */
export interface Publication extends BaseEntityFields {
  user_id: string;
  title: string;
  publisher?: string;
  publication_date?: Date | string;
  authors?: string[];
  url?: string;
  doi?: string;
  abstract?: string;
  citations?: number;
}

/**
 * Volunteer experience
 */
export interface Volunteer extends BaseEntityFields {
  user_id: string;
  organization: string;
  role: string;
  cause?: string;
  start_date?: Date | string;
  end_date?: Date | string;
  current?: boolean;
  description?: string;
  highlights?: string[];
}

/**
 * Complete profile data
 */
export interface CompleteProfile {
  personal: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    bio?: string;
    headline?: string;
  };
  employment: Employment[];
  education: Education[];
  skills: UserSkill[];
  certificates: Certificate[];
  awards: Award[];
  languages?: Language[];
  projects?: Project[];
  publications?: Publication[];
  volunteer?: Volunteer[];
}

/**
 * Profile section visibility settings
 */
export interface ProfileSectionVisibility {
  employment: boolean;
  education: boolean;
  skills: boolean;
  certificates: boolean;
  awards: boolean;
  languages: boolean;
  projects: boolean;
  publications: boolean;
  volunteer: boolean;
}

/**
 * Profile statistics
 */
export interface ProfileStatistics {
  completeness: number;
  total_experience_years: number;
  total_skills: number;
  total_certifications: number;
  total_awards: number;
  last_updated: Date;
}

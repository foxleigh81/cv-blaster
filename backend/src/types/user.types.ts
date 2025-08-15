/**
 * User and authentication related types
 */

import { BaseEntityFields } from './common.types';

/**
 * User role enumeration
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  PREMIUM = 'premium',
}

/**
 * OAuth provider enumeration
 */
export enum OAuthProvider {
  GITHUB = 'github',
  LINKEDIN = 'linkedin',
  GOOGLE = 'google',
}

/**
 * User preferences structure
 */
export interface UserPreferences {
  email_notifications: boolean;
  marketing_emails: boolean;
  language: string;
  timezone: string;
  theme?: 'light' | 'dark' | 'system';
  cv_defaults?: {
    template_id?: string;
    font_size?: number;
    color_scheme?: string;
  };
  privacy?: {
    public_profile: boolean;
    searchable: boolean;
    show_email: boolean;
  };
  custom_settings?: Record<string, any>;

}
/**
 * User entity type
 */
export interface UserEntity extends BaseEntityFields {
  email: string;
  name: string;
  role: string;
  oauth_provider?: string;
  oauth_id?: string;
  preferences: UserPreferences;
}

/**
 * User profile contact information
 */
export interface UserContact {
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
 * User profile data
 */
export interface UserProfile extends BaseEntityFields {
  user_id: string;
  bio?: string;
  contact: UserContact;
  avatar_url?: string;
  headline?: string;
  summary?: string;
  languages?: string[];
  interests?: string[];
}

/**
 * User registration data
 */
export interface UserRegistration {
  email: string;
  name: string;
  provider?: OAuthProvider;
  provider_id?: string;
}

/**
 * User update data
 */
export interface UserUpdate {
  name?: string;
  preferences?: Partial<UserPreferences>;
}

/**
 * User session data
 */
export interface UserSession {
  user: UserEntity;
  access_token: string;
  refresh_token?: string;
  expires_at: Date;
}

/**
 * User statistics
 */
export interface UserStatistics {
  total_cvs: number;
  total_applications: number;
  profile_completeness: number;
  last_login?: Date;
  account_created: Date;
}

/**
 * Common types used throughout the application
 */

/**
 * Base entity fields present in all database entities
 */
export interface BaseEntityFields {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Date range for filtering
 */
export interface DateRange {
  start?: Date | string;
  end?: Date | string;
}

/**
 * JWT payload structure
 */
export interface JwtPayload {
  sub: string; // user id
  email: string;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Current user from JWT token
 */
export interface CurrentUserData {
  sub: string; // user id
  email: string;
  name: string;
  role: string;
}

/**
 * Color scheme for templates
 */
export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
  error?: string;
  warning?: string;
  success?: string;
}

/**
 * Typography settings for templates
 */
export interface Typography {
  fontFamily: string;
  fontSize: {
    base: string;
    small: string;
    large: string;
    h1: string;
    h2: string;
    h3: string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    loose: number;
  };
}

/**
 * Spacing settings for templates
 */
export interface Spacing {
  unit: string;
  small: string;
  medium: string;
  large: string;
  section: string;
  page: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
}

/**
 * Layout settings for templates
 */
export interface Layout {
  columns: number;
  width: string;
  maxWidth: string;
  breakpoints?: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

# CV Blaster Backend Implementation Plan

## Project Overview
Complete implementation of a NestJS backend for CV Blaster with authentication, profile management, CV generation, and export capabilities.

## Requirements Summary

### Core Requirements
1. **NestJS Backend** with comprehensive API routes
2. **Authentication Platform** integrated with NextAuth frontend
3. **Swagger Documentation** for API endpoints
4. **Postman Collection** for API testing
5. **Unit Tests** with complete coverage

### Feature Requirements
- User authentication and profile management
- CV data management (employment, education, skills, certificates, awards)
- Multiple CVs per user with template system
- CV customization (reorder sections, add/remove, custom content)
- Export to PDF and DOCX formats
- Security-first approach for personal data

## Implementation Phases

### Phase 1: Foundation & Core Setup (Critical - Day 1-2)

#### Task 1.1: Project Bootstrap & Basic Structure
**Files to Create:**
- `/backend/` - NestJS project root
- `/backend/src/main.ts` - Application entry point
- `/backend/src/app.module.ts` - Root module
- `/backend/.env.example` - Environment variables template
- `/backend/Dockerfile` - Container configuration
- `/backend/.eslintrc.js` - Linting configuration
- `/backend/tsconfig.json` - TypeScript configuration

**Commands:**
```bash
cd /Users/foxy/dev/internal/cv-blaster
npx @nestjs/cli@latest new backend --skip-git --package-manager npm
cd backend
npm install @nestjs/config @nestjs/swagger
npm install helmet compression
npm install --save-dev @types/node
```

**Configuration:**
- Port: 5000
- CORS enabled for frontend (http://localhost:3000)
- Global validation pipe
- Swagger at /api/docs
- Health check at /api/health

#### Task 1.2: Database Setup & Configuration
**Files to Create:**
- `/backend/src/database/database.module.ts` - Database module
- `/backend/src/database/database.config.ts` - TypeORM configuration
- `/backend/src/common/entities/base.entity.ts` - Base entity with audit fields
- `/backend/ormconfig.ts` - TypeORM CLI configuration

**Commands:**
```bash
npm install @nestjs/typeorm typeorm pg
npm install --save-dev @types/pg
```

**Database Schema:**
```sql
-- Core tables structure
users
profiles
employment_history
education
skills
user_skills
certificates
cv_templates
cvs
cv_sections
cv_custom_sections
```

#### Task 1.3: Authentication Infrastructure
**Files to Create:**
- `/backend/src/auth/auth.module.ts` - Authentication module
- `/backend/src/auth/auth.service.ts` - Auth business logic
- `/backend/src/auth/auth.controller.ts` - Auth endpoints
- `/backend/src/auth/strategies/jwt.strategy.ts` - JWT validation
- `/backend/src/auth/guards/jwt-auth.guard.ts` - Route protection
- `/backend/src/auth/guards/roles.guard.ts` - Role-based access
- `/backend/src/auth/decorators/current-user.decorator.ts` - User extraction
- `/backend/src/auth/dto/` - Auth DTOs

**Commands:**
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install bcrypt class-validator class-transformer
npm install --save-dev @types/passport-jwt @types/bcrypt
```

**Endpoints:**
- `POST /api/auth/oauth` - OAuth login/register (NextAuth integration)
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Current user info
- `POST /api/auth/logout` - Logout

### Phase 2: Core User & Profile Management (Critical - Day 3-4)

#### Task 2.1: User Management System
**Files to Create:**
- `/backend/src/users/users.module.ts` - Users module
- `/backend/src/users/users.service.ts` - User business logic
- `/backend/src/users/users.controller.ts` - User endpoints
- `/backend/src/users/entities/user.entity.ts` - User entity
- `/backend/src/users/entities/profile.entity.ts` - Profile entity
- `/backend/src/users/dto/` - User DTOs

**Endpoints:**
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `DELETE /api/users/account` - Delete account (soft delete)
- `GET /api/users/preferences` - Get preferences
- `PUT /api/users/preferences` - Update preferences

#### Task 2.2: Profile Data Entities
**Files to Create:**
- `/backend/src/profile/profile.module.ts` - Profile data module
- `/backend/src/profile/entities/employment.entity.ts`
- `/backend/src/profile/entities/education.entity.ts`
- `/backend/src/profile/entities/skill.entity.ts`
- `/backend/src/profile/entities/certificate.entity.ts`
- `/backend/src/profile/entities/award.entity.ts`
- `/backend/src/profile/dto/` - Profile DTOs

**Entity Relationships:**
```
User (1) -> (*) Employment
User (1) -> (*) Education
User (*) <-> (*) Skills (through user_skills)
User (1) -> (*) Certificates
User (1) -> (*) Awards
```

#### Task 2.3: Profile API Endpoints
**Files to Create:**
- `/backend/src/profile/controllers/employment.controller.ts`
- `/backend/src/profile/controllers/education.controller.ts`
- `/backend/src/profile/controllers/skills.controller.ts`
- `/backend/src/profile/controllers/certificates.controller.ts`
- `/backend/src/profile/services/` - Corresponding services

**Endpoints Pattern (for each entity):**
- `GET /api/profile/employment` - List all
- `GET /api/profile/employment/:id` - Get one
- `POST /api/profile/employment` - Create
- `PUT /api/profile/employment/:id` - Update
- `DELETE /api/profile/employment/:id` - Delete
- `POST /api/profile/employment/bulk` - Bulk operations

### Phase 3: CV Management Core (High Priority - Day 5-7)

#### Task 3.1: CV Templates System
**Files to Create:**
- `/backend/src/cv-templates/cv-templates.module.ts`
- `/backend/src/cv-templates/entities/cv-template.entity.ts`
- `/backend/src/cv-templates/templates/modern.template.ts`
- `/backend/src/cv-templates/templates/classic.template.ts`
- `/backend/src/cv-templates/services/template-engine.service.ts`

**Template Structure:**
```typescript
interface CVTemplate {
  id: string;
  name: string;
  description: string;
  structure: {
    sections: SectionDefinition[];
    layout: 'single-column' | 'two-column';
    colorScheme: ColorScheme;
  };
  customizable: {
    colors: boolean;
    fonts: boolean;
    spacing: boolean;
  };
}
```

#### Task 3.2: CV Creation & Management
**Files to Create:**
- `/backend/src/cv/cv.module.ts`
- `/backend/src/cv/entities/cv.entity.ts`
- `/backend/src/cv/entities/cv-section.entity.ts`
- `/backend/src/cv/services/cv.service.ts`
- `/backend/src/cv/services/cv-builder.service.ts`
- `/backend/src/cv/controllers/cv.controller.ts`

**Endpoints:**
- `GET /api/cv` - List user's CVs
- `GET /api/cv/:id` - Get CV details
- `POST /api/cv` - Create CV from profile
- `PUT /api/cv/:id` - Update CV
- `DELETE /api/cv/:id` - Delete CV
- `POST /api/cv/:id/duplicate` - Duplicate CV

#### Task 3.3: Advanced CV Editing Features
**Files to Create:**
- `/backend/src/cv/entities/cv-custom-section.entity.ts`
- `/backend/src/cv/services/cv-editor.service.ts`
- `/backend/src/cv/controllers/cv-editor.controller.ts`

**Endpoints:**
- `PUT /api/cv/:id/sections/order` - Reorder sections
- `POST /api/cv/:id/sections/custom` - Add custom section
- `PUT /api/cv/:id/sections/:sectionId` - Update section
- `DELETE /api/cv/:id/sections/:sectionId` - Remove section
- `PUT /api/cv/:id/sections/:sectionId/visibility` - Toggle visibility

### Phase 4: Export & Documentation (High Priority - Day 8-9)

#### Task 4.1: PDF Export Implementation
**Files to Create:**
- `/backend/src/export/export.module.ts`
- `/backend/src/export/services/pdf-export.service.ts`
- `/backend/src/export/templates/pdf/` - PDF templates
- `/backend/src/export/controllers/export.controller.ts`

**Commands:**
```bash
npm install puppeteer
npm install --save-dev @types/puppeteer
```

**Endpoints:**
- `GET /api/cv/:id/export/pdf` - Export as PDF
- `GET /api/cv/:id/preview` - Generate preview

#### Task 4.2: DOCX Export Implementation
**Files to Create:**
- `/backend/src/export/services/docx-export.service.ts`
- `/backend/src/export/templates/docx/` - DOCX templates

**Commands:**
```bash
npm install docx
```

**Endpoints:**
- `GET /api/cv/:id/export/docx` - Export as DOCX

#### Task 4.3: Swagger Documentation
**Configuration:**
```typescript
// main.ts
const config = new DocumentBuilder()
  .setTitle('CV Blaster API')
  .setDescription('API for CV management and generation')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
```

### Phase 5: Testing & Quality Assurance (High Priority - Day 10-11)

#### Task 5.1: Unit Test Implementation
**Test Files Structure:**
```
/backend/src/
  auth/
    auth.service.spec.ts
    auth.controller.spec.ts
  users/
    users.service.spec.ts
    users.controller.spec.ts
  profile/
    *.service.spec.ts
    *.controller.spec.ts
  cv/
    cv.service.spec.ts
    cv-builder.service.spec.ts
  export/
    pdf-export.service.spec.ts
    docx-export.service.spec.ts
```

**Commands:**
```bash
npm run test
npm run test:cov
npm run test:watch
```

#### Task 5.2: Integration Testing
**Files to Create:**
- `/backend/test/auth.e2e-spec.ts`
- `/backend/test/cv-workflow.e2e-spec.ts`
- `/backend/test/export.e2e-spec.ts`

### Phase 6: Advanced Features & Polish (Medium Priority - Day 12)

#### Task 6.1: Postman Collection
**File to Create:**
- `/backend/postman/CV-Blaster-API.postman_collection.json`
- `/backend/postman/CV-Blaster.postman_environment.json`

**Collection Structure:**
```
CV Blaster API
├── Authentication
│   ├── OAuth Login
│   ├── Refresh Token
│   └── Get Current User
├── User Profile
│   ├── Get Profile
│   └── Update Profile
├── Profile Data
│   ├── Employment
│   ├── Education
│   ├── Skills
│   └── Certificates
├── CV Management
│   ├── Create CV
│   ├── Edit CV
│   └── Delete CV
└── Export
    ├── Export PDF
    └── Export DOCX
```

#### Task 6.2: Performance Optimization
**Optimizations:**
- Database query optimization with indexes
- Implement caching with Redis (optional)
- Lazy loading for relations
- Pagination for list endpoints
- Query result transformation

#### Task 6.3: Security Hardening
**Security Measures:**
- Rate limiting with @nestjs/throttler
- Input sanitization
- Security headers with helmet
- Audit logging
- OWASP security checklist

## Docker Configuration

### Dockerfile
```dockerfile
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=development /app/dist ./dist
EXPOSE 5000
CMD ["node", "dist/main"]
```

### docker-compose.yml Update
```yaml
backend:
  build: 
    context: ./backend
    target: development
  ports:
    - "5000:5000"
  environment:
    - NODE_ENV=development
    - DATABASE_URL=postgresql://cvblaster:password@db:5432/cv_blaster
    - JWT_SECRET=${JWT_SECRET}
    - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
  volumes:
    - ./backend:/app
    - /app/node_modules
  depends_on:
    db:
      condition: service_healthy
```

## Environment Variables

### .env.example
```env
# Application
NODE_ENV=development
PORT=5000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=cvblaster
DATABASE_PASSWORD=secure_password
DATABASE_NAME=cv_blaster

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=7d
NEXTAUTH_SECRET=must_match_frontend_secret

# CORS
CORS_ORIGIN=http://localhost:3000

# Export
PDF_GENERATION_TIMEOUT=30000
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": { }
  }
}
```

## Database Schema Overview

### Core Tables
```sql
-- Users & Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Profile Information
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  bio TEXT,
  phone VARCHAR(50),
  location VARCHAR(255),
  website VARCHAR(255),
  linkedin VARCHAR(255),
  github VARCHAR(255)
);

-- Employment History
CREATE TABLE employment_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  description TEXT,
  achievements JSONB
);

-- CVs
CREATE TABLE cvs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  template_id UUID REFERENCES cv_templates(id),
  name VARCHAR(255) NOT NULL,
  data JSONB,
  settings JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Success Criteria

### Phase 1 Complete When:
- [ ] NestJS app runs in Docker
- [ ] Database connected and migrations work
- [ ] JWT authentication functional
- [ ] NextAuth integration works

### Phase 2 Complete When:
- [ ] User profiles fully manageable
- [ ] All profile sections CRUD operations work
- [ ] Data validation implemented
- [ ] At least one employment entry enforced

### Phase 3 Complete When:
- [ ] 2 CV templates available
- [ ] CVs can be created from profile
- [ ] Sections can be customized
- [ ] Multiple CVs per user supported

### Phase 4 Complete When:
- [ ] PDF export generates quality documents
- [ ] DOCX export maintains formatting
- [ ] Swagger docs complete
- [ ] All endpoints documented

### Phase 5 Complete When:
- [ ] 90%+ test coverage achieved
- [ ] All critical paths tested
- [ ] Integration tests pass
- [ ] Error handling comprehensive

### Phase 6 Complete When:
- [ ] Postman collection complete
- [ ] Performance optimized
- [ ] Security hardened
- [ ] Ready for production

## Notes for Implementation

1. **Security First**: Every endpoint must validate input, check authorization, and sanitize output
2. **TypeScript Strict**: Use strict TypeScript settings for type safety
3. **Error Handling**: Consistent error format across all endpoints
4. **Logging**: Implement comprehensive logging for debugging
5. **Documentation**: Keep Swagger docs updated as you build
6. **Testing**: Write tests alongside features, not after

## Next Steps

1. Initialize NestJS project
2. Set up Docker environment
3. Configure database connection
4. Implement authentication
5. Build features incrementally
6. Test continuously
7. Document everything
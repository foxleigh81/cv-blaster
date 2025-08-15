# CV Blaster API Endpoints Reference

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://api.cvblaster.com/api`

## Authentication Required
All endpoints except `/auth/oauth` require JWT Bearer token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Authentication Endpoints

#### OAuth Login/Register
```http
POST /api/auth/oauth
Content-Type: application/json

{
  "provider": "github" | "linkedin",
  "accessToken": "oauth_access_token",
  "profile": {
    "id": "oauth_user_id",
    "email": "user@example.com",
    "name": "User Name",
    "image": "profile_image_url"
  }
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": { ...userObject },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token"
  }
}
```

#### Get Current User
```http
GET /api/auth/me

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user",
    "profile": { ...profileData }
  }
}
```

### User Profile Endpoints

#### Get User Profile
```http
GET /api/users/profile

Response: 200 OK
{
  "success": true,
  "data": {
    "bio": "Professional summary",
    "phone": "+1234567890",
    "location": "City, Country",
    "website": "https://example.com",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username"
  }
}
```

#### Update User Profile
```http
PUT /api/users/profile
Content-Type: application/json

{
  "bio": "Updated bio",
  "phone": "+1234567890",
  "location": "New City",
  "website": "https://newsite.com",
  "linkedin": "linkedin.com/in/newusername",
  "github": "github.com/newusername"
}

Response: 200 OK
{
  "success": true,
  "data": { ...updatedProfile }
}
```

### Employment History Endpoints

#### List Employment History
```http
GET /api/profile/employment
Query params: ?page=1&limit=10&sort=startDate:DESC

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "employment_id",
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "2020-01-01",
      "endDate": "2023-12-31",
      "current": false,
      "description": "Job description",
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### Get Single Employment
```http
GET /api/profile/employment/:id

Response: 200 OK
{
  "success": true,
  "data": { ...employmentObject }
}
```

#### Create Employment Entry
```http
POST /api/profile/employment
Content-Type: application/json

{
  "company": "New Company",
  "position": "Senior Developer",
  "startDate": "2024-01-01",
  "current": true,
  "description": "Leading development team",
  "achievements": ["Built new system", "Improved performance"]
}

Response: 201 Created
{
  "success": true,
  "data": { ...createdEmployment }
}
```

#### Update Employment Entry
```http
PUT /api/profile/employment/:id
Content-Type: application/json

{
  "position": "Lead Developer",
  "endDate": "2024-06-30",
  "current": false
}

Response: 200 OK
{
  "success": true,
  "data": { ...updatedEmployment }
}
```

#### Delete Employment Entry
```http
DELETE /api/profile/employment/:id

Response: 204 No Content
```

### Education Endpoints

#### List Education
```http
GET /api/profile/education

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "education_id",
      "institution": "University Name",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "startDate": "2016-09-01",
      "endDate": "2020-06-30",
      "gpa": "3.8",
      "achievements": ["Dean's List", "Summa Cum Laude"]
    }
  ]
}
```

#### Create Education Entry
```http
POST /api/profile/education
Content-Type: application/json

{
  "institution": "University Name",
  "degree": "Master of Science",
  "field": "Software Engineering",
  "startDate": "2020-09-01",
  "endDate": "2022-06-30",
  "gpa": "4.0"
}

Response: 201 Created
{
  "success": true,
  "data": { ...createdEducation }
}
```

### Skills Endpoints

#### List All Skills
```http
GET /api/profile/skills

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "skill_id",
      "name": "JavaScript",
      "category": "Programming Language",
      "proficiency": "Expert",
      "yearsOfExperience": 5
    }
  ]
}
```

#### Add Skills (Bulk)
```http
POST /api/profile/skills/bulk
Content-Type: application/json

{
  "skills": [
    {
      "name": "TypeScript",
      "category": "Programming Language",
      "proficiency": "Advanced",
      "yearsOfExperience": 3
    },
    {
      "name": "React",
      "category": "Framework",
      "proficiency": "Expert",
      "yearsOfExperience": 4
    }
  ]
}

Response: 201 Created
{
  "success": true,
  "data": {
    "created": 2,
    "skills": [ ...createdSkills ]
  }
}
```

### CV Management Endpoints

#### List User's CVs
```http
GET /api/cv

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "cv_id",
      "name": "Software Engineer CV",
      "templateId": "modern_template",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z",
      "settings": {
        "colorScheme": "blue",
        "fontSize": "medium"
      }
    }
  ]
}
```

#### Get CV Details
```http
GET /api/cv/:id

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "cv_id",
    "name": "Software Engineer CV",
    "templateId": "modern_template",
    "sections": [
      {
        "id": "section_id",
        "type": "employment",
        "order": 1,
        "visible": true,
        "data": { ...sectionData }
      }
    ],
    "customSections": [
      {
        "id": "custom_section_id",
        "title": "Projects",
        "content": "<p>Rich text content</p>",
        "order": 5
      }
    ]
  }
}
```

#### Create CV from Profile
```http
POST /api/cv
Content-Type: application/json

{
  "name": "Full Stack Developer CV",
  "templateId": "modern_template",
  "includeProfile": true,
  "includeEmployment": true,
  "includeEducation": true,
  "includeSkills": true,
  "settings": {
    "colorScheme": "purple",
    "fontSize": "medium",
    "spacing": "normal"
  }
}

Response: 201 Created
{
  "success": true,
  "data": { ...createdCV }
}
```

#### Update CV
```http
PUT /api/cv/:id
Content-Type: application/json

{
  "name": "Updated CV Name",
  "settings": {
    "colorScheme": "green"
  }
}

Response: 200 OK
{
  "success": true,
  "data": { ...updatedCV }
}
```

#### Duplicate CV
```http
POST /api/cv/:id/duplicate
Content-Type: application/json

{
  "name": "Copy of Software Engineer CV"
}

Response: 201 Created
{
  "success": true,
  "data": { ...duplicatedCV }
}
```

### CV Section Management

#### Reorder Sections
```http
PUT /api/cv/:id/sections/order
Content-Type: application/json

{
  "sections": [
    { "id": "section_1", "order": 0 },
    { "id": "section_2", "order": 1 },
    { "id": "section_3", "order": 2 }
  ]
}

Response: 200 OK
{
  "success": true,
  "message": "Sections reordered successfully"
}
```

#### Add Custom Section
```http
POST /api/cv/:id/sections/custom
Content-Type: application/json

{
  "title": "Volunteer Experience",
  "content": "<h3>Community Service</h3><p>Description of volunteer work...</p>",
  "order": 4
}

Response: 201 Created
{
  "success": true,
  "data": { ...createdSection }
}
```

#### Toggle Section Visibility
```http
PUT /api/cv/:id/sections/:sectionId/visibility
Content-Type: application/json

{
  "visible": false
}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "section_id",
    "visible": false
  }
}
```

### Export Endpoints

#### Export CV as PDF
```http
GET /api/cv/:id/export/pdf

Response: 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="cv-name.pdf"

[Binary PDF Data]
```

#### Export CV as DOCX
```http
GET /api/cv/:id/export/docx

Response: 200 OK
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
Content-Disposition: attachment; filename="cv-name.docx"

[Binary DOCX Data]
```

#### Generate CV Preview
```http
GET /api/cv/:id/preview

Response: 200 OK
{
  "success": true,
  "data": {
    "html": "<html>...rendered CV HTML...</html>",
    "css": "...styles...",
    "previewUrl": "/api/cv/:id/preview/image"
  }
}
```

### CV Templates Endpoints

#### List Available Templates
```http
GET /api/cv-templates

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "modern_template",
      "name": "Modern",
      "description": "Clean and modern design",
      "preview": "/api/cv-templates/modern/preview",
      "customizable": {
        "colors": true,
        "fonts": true,
        "spacing": true
      }
    },
    {
      "id": "classic_template",
      "name": "Classic",
      "description": "Traditional professional layout",
      "preview": "/api/cv-templates/classic/preview",
      "customizable": {
        "colors": true,
        "fonts": false,
        "spacing": true
      }
    }
  ]
}
```

#### Get Template Details
```http
GET /api/cv-templates/:id

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "modern_template",
    "name": "Modern",
    "description": "Clean and modern design",
    "structure": {
      "sections": ["header", "summary", "employment", "education", "skills"],
      "layout": "two-column",
      "defaultColorScheme": {
        "primary": "#2563eb",
        "secondary": "#64748b",
        "text": "#1e293b"
      }
    }
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "email": ["Email is required", "Email must be valid"]
      }
    }
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to access this resource"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "details": {
      "retryAfter": 60
    }
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

## Rate Limiting

- Default: 100 requests per minute per IP
- Authenticated: 1000 requests per minute per user
- Export endpoints: 10 requests per minute per user

## Pagination

All list endpoints support pagination with query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sort`: Sort field and order (e.g., `createdAt:DESC`)

## Filtering

List endpoints support filtering:
- Employment: `?current=true&company=Google`
- Education: `?degree=Bachelor&field=Computer`
- Skills: `?category=Programming&proficiency=Expert`

## Webhooks (Future)

Planned webhook events:
- `cv.created`
- `cv.exported`
- `profile.updated`
- `user.deleted`
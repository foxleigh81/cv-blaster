# CV Blaster API Testing Guide

## Quick Start

The backend API is running at: `http://localhost:5001`

## Testing Options

### 1. Swagger UI (Recommended for Quick Testing)

Open your browser and go to: **http://localhost:5001/api/docs**

This provides an interactive UI where you can:

- See all available endpoints
- Try out API calls directly from the browser
- View request/response schemas
- Authenticate with JWT tokens

### 2. Using cURL (Command Line)

#### Health Check

```bash
curl http://localhost:5001/api/health
```

#### Create a Test User (OAuth Login)

```bash
curl -X POST http://localhost:5001/api/auth/oauth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "oauth_provider": "github",
    "oauth_id": "github123"
  }'
```

Save the `access_token` from the response for authenticated requests.

#### Get Current User (Authenticated)

```bash
curl http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Using Postman

Import the collection file: `backend/postman/CV-Blaster-API.postman_collection.json`

### 4. Testing Flow

Here's the recommended testing flow:

#### Step 1: Authentication

1. Create/login a user via OAuth endpoint
2. Save the JWT token from response

#### Step 2: Profile Setup

1. Update user profile
2. Add employment history
3. Add education
4. Add skills
5. Add certificates (optional)
6. Add awards (optional)

#### Step 3: CV Creation

1. Get available CV templates
2. Create a CV from profile
3. View your CV
4. Customize CV sections

#### Step 4: CV Management

1. Update CV settings
2. Reorder sections
3. Add custom sections
4. Toggle section visibility
5. Duplicate CV
6. Set default CV

## Sample API Requests

### 1. OAuth Login (Creates user if doesn't exist)

```http
POST /api/auth/oauth
{
  "email": "john@example.com",
  "name": "John Doe",
  "oauth_provider": "github",
  "oauth_id": "github_123456"
}
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### 2. Add Employment History

```http
POST /api/profile/employment
Authorization: Bearer YOUR_TOKEN

{
  "company": "Tech Corp",
  "position": "Senior Developer",
  "start_date": "2020-01-01",
  "end_date": null,
  "current": true,
  "description": "Leading development team",
  "achievements": ["Built scalable API", "Improved performance by 50%"]
}
```

### 3. Add Education

```http
POST /api/profile/education
Authorization: Bearer YOUR_TOKEN

{
  "institution": "University of Technology",
  "degree": "Bachelor of Science",
  "field": "Computer Science",
  "graduation_date": "2019-06-01",
  "gpa": 3.8,
  "description": "Focus on software engineering and AI"
}
```

### 4. Add Skills

```http
POST /api/profile/skills
Authorization: Bearer YOUR_TOKEN

{
  "name": "TypeScript",
  "category": "Programming",
  "proficiency": 5,
  "years": 4
}
```

### 5. Create CV from Profile

```http
POST /api/cv/from-profile
Authorization: Bearer YOUR_TOKEN

{
  "template_id": null,  // Will use default template
  "name": "My Professional CV"
}
```

### 6. Get Your CVs

```http
GET /api/cv
Authorization: Bearer YOUR_TOKEN
```

### 7. Update CV Section Order

```http
PUT /api/cv/{cv_id}/sections/order
Authorization: Bearer YOUR_TOKEN

{
  "order": [
    { "section_id": "uuid1", "order": 1 },
    { "section_id": "uuid2", "order": 2 },
    { "section_id": "uuid3", "order": 3 }
  ]
}
```

## Environment Variables

Make sure your `.env` file has these values:

```env
NODE_ENV=development
PORT=5001
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=cvblaster
DATABASE_PASSWORD=password
DATABASE_NAME=cv_blaster
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=7d
NEXTAUTH_SECRET=dev_nextauth_secret
CORS_ORIGIN=http://localhost:3000
```

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps | grep cv-blaster-db

# If not, start it:
docker-compose up -d db
```

### Port Already in Use

If port 5001 is already in use, you can change it in the `.env` file.

### View Logs

```bash
# In the backend directory
npm run start:dev
```

## API Documentation

Full API documentation with all endpoints, request/response schemas, and authentication requirements is available at:
**http://localhost:5001/api/docs**

## Next Steps

Once you've tested the basic flow, you can:

1. Test bulk operations
2. Try custom CV sections
3. Test CV duplication
4. Experiment with different templates
5. Test error cases (invalid data, unauthorized access, etc.)

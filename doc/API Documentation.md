# EduMentor API Documentation 🔌

## 📋 API Overview
The EduMentor API provides comprehensive endpoints for managing educational project workflows, user interactions, and hackathon events. All APIs follow RESTful principles and return JSON responses.

**Base URL**: `https://api.edumentor.com/v1`
**Authentication**: Bearer Token (JWT)

## 🔐 Authentication

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "student@college.edu",
  "password": "SecurePassword123!",
  "role": "student",
  "profile": {
    "name": "John Doe",
    "college": "MIT",
    "department": "Computer Science",
    "year": 3
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64a7b8c9d1e2f3g4h5i6j7k8",
      "email": "student@college.edu",
      "role": "student",
      "profile": {
        "name": "John Doe",
        "college": "MIT",
        "department": "Computer Science"
      }
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### POST /auth/login
Authenticate user and receive access tokens.

**Request Body:**
```json
{
  "email": "student@college.edu",
  "password": "SecurePassword123!"
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/logout
Logout user and invalidate tokens.

---

## 👥 User Management APIs

### GET /users
Get list of users with filtering and pagination.

**Query Parameters:**
- `role` (optional): Filter by user role
- `college` (optional): Filter by college
- `page` (default: 1): Page number
- `limit` (default: 20): Items per page
- `search` (optional): Search by name or email

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "64a7b8c9d1e2f3g4h5i6j7k8",
        "email": "student@college.edu",
        "role": "student",
        "profile": {
          "name": "John Doe",
          "avatar": "https://cdn.edumentor.com/avatars/john.jpg",
          "college": "MIT",
          "department": "Computer Science",
          "skills": ["JavaScript", "Python", "React"]
        },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### GET /users/:id
Get specific user details.

### PUT /users/:id
Update user profile information.

### DELETE /users/:id
Delete user account (Admin only).

---

## 📚 Project Management APIs

### GET /projects
Get list of projects with filtering options.

**Query Parameters:**
- `status` (optional): Filter by project status
- `category` (optional): Filter by project category
- `student` (optional): Filter by student ID
- `mentor` (optional): Filter by mentor ID
- `college` (optional): Filter by college
- `page` (default: 1): Page number
- `limit` (default: 20): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "64a7b8c9d1e2f3g4h5i6j7k8",
        "title": "AI-Powered Student Assistant",
        "description": "A chatbot to help students with academic queries",
        "category": "major",
        "status": "active",
        "student": {
          "id": "64a7b8c9d1e2f3g4h5i6j7k8",
          "name": "John Doe",
          "email": "john@college.edu"
        },
        "mentor": {
          "id": "64a7b8c9d1e2f3g4h5i6j7k9",
          "name": "Dr. Smith",
          "email": "smith@college.edu"
        },
        "technologies": ["Python", "TensorFlow", "Flask"],
        "timeline": {
          "startDate": "2024-01-15T00:00:00Z",
          "endDate": "2024-05-15T00:00:00Z",
          "progress": 65
        },
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-03-10T14:20:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 45
    }
  }
}
```

### POST /projects
Create a new project.

**Request Body:**
```json
{
  "title": "AI-Powered Student Assistant",
  "description": "A comprehensive chatbot system to help students with academic queries and provide personalized learning recommendations.",
  "problemStatement": "Students often struggle to find quick answers to academic questions and need personalized guidance.",
  "category": "major",
  "technologies": ["Python", "TensorFlow", "Flask", "MongoDB"],
  "timeline": {
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": "2024-05-15T00:00:00Z",
    "milestones": [
      {
        "title": "Research and Planning",
        "description": "Complete literature review and system design",
        "dueDate": "2024-02-15T00:00:00Z"
      },
      {
        "title": "MVP Development",
        "description": "Develop minimum viable product",
        "dueDate": "2024-03-30T00:00:00Z"
      }
    ]
  },
  "resources": [
    {
      "type": "document",
      "title": "Project Proposal",
      "url": "https://docs.google.com/document/d/abc123"
    }
  ]
}
```

### GET /projects/:id
Get detailed project information.

### PUT /projects/:id
Update project details.

### DELETE /projects/:id
Delete project (Student/Admin only).

### POST /projects/:id/milestones
Add milestone to project.

### PUT /projects/:id/milestones/:milestoneId
Update milestone status.

### POST /projects/:id/resources
Add resource to project.

---

## 🏆 Hackathon Management APIs

### GET /hackathons
Get list of hackathons.

**Query Parameters:**
- `type` (optional): Filter by hackathon type (internal/global)
- `status` (optional): Filter by status
- `organizer` (optional): Filter by organizer ID
- `upcoming` (optional): Show only upcoming events

**Response:**
```json
{
  "success": true,
  "data": {
    "hackathons": [
      {
        "id": "64a7b8c9d1e2f3g4h5i6j7k8",
        "title": "AI Innovation Challenge 2024",
        "description": "Build innovative AI solutions for real-world problems",
        "type": "global",
        "status": "open",
        "organizer": {
          "type": "company",
          "name": "TechCorp Inc.",
          "logo": "https://cdn.edumentor.com/logos/techcorp.png"
        },
        "timeline": {
          "registrationStart": "2024-03-01T00:00:00Z",
          "registrationEnd": "2024-03-20T23:59:59Z",
          "eventStart": "2024-03-25T09:00:00Z",
          "eventEnd": "2024-03-27T18:00:00Z"
        },
        "prizes": [
          {
            "position": "1st Place",
            "amount": 10000,
            "description": "Cash prize and internship opportunity"
          }
        ],
        "participantCount": 156,
        "maxParticipants": 500,
        "createdAt": "2024-02-15T10:30:00Z"
      }
    ]
  }
}
```

### POST /hackathons
Create new hackathon event.

**Request Body:**
```json
{
  "title": "AI Innovation Challenge 2024",
  "description": "Build innovative AI solutions for real-world problems",
  "type": "global",
  "timeline": {
    "registrationStart": "2024-03-01T00:00:00Z",
    "registrationEnd": "2024-03-20T23:59:59Z",
    "eventStart": "2024-03-25T09:00:00Z",
    "eventEnd": "2024-03-27T18:00:00Z"
  },
  "rules": "Teams of 2-4 members. Original code only. 48-hour development window.",
  "prizes": [
    {
      "position": "1st Place",
      "amount": 10000,
      "description": "Cash prize and internship opportunity"
    }
  ],
  "maxParticipants": 500,
  "requirements": ["Valid student ID", "GitHub account"],
  "themes": ["Artificial Intelligence", "Machine Learning", "Data Science"]
}
```

### GET /hackathons/:id
Get detailed hackathon information.

### PUT /hackathons/:id
Update hackathon details.

### POST /hackathons/:id/register
Register for hackathon.

### POST /hackathons/:id/teams
Create team for hackathon.

### GET /hackathons/:id/teams
Get teams participating in hackathon.

### POST /hackathons/:id/submissions
Submit project for hackathon.

---

## 🤝 Mentor Matching APIs

### GET /mentors
Get list of available mentors.

**Query Parameters:**
- `skills` (optional): Filter by mentor skills
- `department` (optional): Filter by department
- `availability` (optional): Filter by availability status
- `rating` (optional): Minimum rating filter

### POST /mentor-requests
Send mentor request.

**Request Body:**
```json
{
  "mentorId": "64a7b8c9d1e2f3g4h5i6j7k9",
  "projectId": "64a7b8c9d1e2f3g4h5i6j7k8",
  "message": "I would like you to mentor my AI project. Your expertise in machine learning would be invaluable."
}
```

### GET /mentor-requests
Get mentor requests (for mentors).

### PUT /mentor-requests/:id
Accept/reject mentor request.

### GET /ai-mentor-suggestions/:projectId
Get AI-powered mentor suggestions for a project.

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "mentor": {
          "id": "64a7b8c9d1e2f3g4h5i6j7k9",
          "name": "Dr. Sarah Johnson",
          "department": "Computer Science",
          "expertise": ["Machine Learning", "AI", "Python"],
          "rating": 4.8,
          "projectsCompleted": 23
        },
        "matchScore": 0.92,
        "reasons": [
          "Expertise in Machine Learning matches project requirements",
          "High success rate with similar projects",
          "Available for new mentorship"
        ]
      }
    ]
  }
}
```

---

## 💬 Communication APIs

### GET /messages
Get user messages.

### POST /messages
Send new message.

**Request Body:**
```json
{
  "recipientId": "64a7b8c9d1e2f3g4h5i6j7k9",
  "content": "Hi Dr. Johnson, I have a question about my project milestone.",
  "type": "text",
  "projectId": "64a7b8c9d1e2f3g4h5i6j7k8"
}
```

### GET /conversations
Get user conversations.

### GET /conversations/:id/messages
Get messages in specific conversation.

### POST /video-calls
Initiate video call.

---

## 📊 Analytics APIs

### GET /analytics/dashboard
Get dashboard analytics for current user.

**Response:**
```json
{
  "success": true,
  "data": {
    "student": {
      "activeProjects": 2,
      "completedProjects": 5,
      "hackathonsParticipated": 3,
      "skillsAcquired": 12,
      "mentorRating": 4.6
    },
    "recentActivity": [
      {
        "type": "milestone_completed",
        "description": "Completed 'Research Phase' milestone",
        "timestamp": "2024-03-10T14:30:00Z"
      }
    ],
    "upcomingDeadlines": [
      {
        "type": "milestone",
        "title": "MVP Development",
        "dueDate": "2024-03-30T00:00:00Z",
        "projectTitle": "AI Student Assistant"
      }
    ]
  }
}
```

### GET /analytics/projects/:id
Get detailed project analytics.

### GET /analytics/institutions/:id
Get institution-level analytics (Admin only).

---

## 🔔 Notification APIs

### GET /notifications
Get user notifications.

### PUT /notifications/:id/read
Mark notification as read.

### PUT /notifications/read-all
Mark all notifications as read.

### POST /notifications/preferences
Update notification preferences.

---

## 📁 File Management APIs

### POST /files/upload
Upload file to system.

**Request:** Multipart form data
- `file`: File to upload
- `type`: File type (document, image, video)
- `projectId` (optional): Associated project ID

**Response:**
```json
{
  "success": true,
  "data": {
    "fileId": "64a7b8c9d1e2f3g4h5i6j7k8",
    "filename": "project_proposal.pdf",
    "url": "https://cdn.edumentor.com/files/64a7b8c9d1e2f3g4h5i6j7k8.pdf",
    "size": 2048576,
    "type": "document",
    "uploadedAt": "2024-03-10T14:30:00Z"
  }
}
```

### GET /files/:id
Download file.

### DELETE /files/:id
Delete file.

---

## 🔍 Search APIs

### GET /search
Global search across projects, users, and hackathons.

**Query Parameters:**
- `q`: Search query
- `type` (optional): Filter by content type
- `filters` (optional): Additional filters

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "project",
        "id": "64a7b8c9d1e2f3g4h5i6j7k8",
        "title": "AI-Powered Student Assistant",
        "description": "A chatbot to help students...",
        "relevanceScore": 0.95
      }
    ],
    "totalResults": 23,
    "searchTime": "0.045s"
  }
}
```

---

## 📋 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-03-10T14:30:00Z",
  "requestId": "req_64a7b8c9d1e2f3g4h5i6j7k8"
}
```

### Common Error Codes
- `AUTHENTICATION_REQUIRED` (401): User not authenticated
- `AUTHORIZATION_FAILED` (403): Insufficient permissions
- `RESOURCE_NOT_FOUND` (404): Requested resource not found
- `VALIDATION_ERROR` (400): Invalid input data
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_SERVER_ERROR` (500): Server error

---

## 🔄 Rate Limiting

### Rate Limits
- **General API**: 1000 requests per hour per user
- **Authentication**: 10 requests per minute per IP
- **File Upload**: 50 requests per hour per user
- **Search**: 100 requests per hour per user

### Rate Limit Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

---

## 🔌 Webhooks

### Webhook Events
- `project.created`
- `project.updated`
- `project.completed`
- `mentor.assigned`
- `hackathon.registered`
- `message.received`

### Webhook Payload Example
```json
{
  "event": "project.completed",
  "timestamp": "2024-03-10T14:30:00Z",
  "data": {
    "projectId": "64a7b8c9d1e2f3g4h5i6j7k8",
    "studentId": "64a7b8c9d1e2f3g4h5i6j7k7",
    "mentorId": "64a7b8c9d1e2f3g4h5i6j7k9",
    "completionDate": "2024-03-10T14:30:00Z"
  }
}
```

---

## 📚 SDK & Libraries

### JavaScript SDK
```javascript
import EduMentorAPI from '@edumentor/sdk';

const api = new EduMentorAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.edumentor.com/v1'
});

// Get projects
const projects = await api.projects.list({
  status: 'active',
  limit: 10
});

// Create project
const newProject = await api.projects.create({
  title: 'My New Project',
  description: 'Project description',
  category: 'major'
});
```

### Python SDK
```python
from edumentor import EduMentorAPI

api = EduMentorAPI(
    api_key='your-api-key',
    base_url='https://api.edumentor.com/v1'
)

# Get projects
projects = api.projects.list(status='active', limit=10)

# Create project
new_project = api.projects.create({
    'title': 'My New Project',
    'description': 'Project description',
    'category': 'major'
})
```

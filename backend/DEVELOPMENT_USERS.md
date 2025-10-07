# Development Users Guide

This document contains all the development user credentials for testing different roles in the EduMentor application.

## How to Run the Seed Script

### Option 1: Direct TypeScript execution
```bash
cd backend
npm run seed
```

### Option 2: Build and run
```bash
cd backend
npm run seed:build
```

## Development User Credentials

### 🔹 ADMIN USERS
| Email | Password | Name | Role |
|-------|----------|------|------|
| admin@edumentor.dev | admin123 | Admin User | admin |
| superadmin@edumentor.dev | superadmin123 | Super Admin | admin |

### 🔹 MENTOR USERS
| Email | Password | Name | Role |
|-------|----------|------|------|
| mentor@edumentor.dev | mentor123 | John Mentor | mentor |
| mentor2@edumentor.dev | mentor123 | Sarah Johnson | mentor |
| mentor3@edumentor.dev | mentor123 | Michael Chen | mentor |

### 🔹 STUDENT USERS
| Email | Password | Name | Role |
|-------|----------|------|------|
| student@edumentor.dev | student123 | Alice Student | student |
| student2@edumentor.dev | student123 | Bob Wilson | student |
| student3@edumentor.dev | student123 | Emma Davis | student |
| student4@edumentor.dev | student123 | David Brown | student |

### 🔹 ORGANIZER USERS
| Email | Password | Name | Role |
|-------|----------|------|------|
| organizer@edumentor.dev | organizer123 | Event Organizer | organizer |
| organizer2@edumentor.dev | organizer123 | Conference Manager | organizer |

### 🔹 COMPANY USERS
| Email | Password | Name | Role |
|-------|----------|------|------|
| company@edumentor.dev | company123 | Tech Corp | company |
| company2@edumentor.dev | company123 | Innovation Labs | company |
| company3@edumentor.dev | company123 | Startup Hub | company |

## Features of Each User

### ✅ All Users Have:
- ✅ Email verified
- ✅ Mobile verified  
- ✅ Active status
- ✅ Standardized passwords for easy testing
- ✅ Valid mobile numbers
- ✅ Complete profile information

### 🔐 Password Pattern:
- **Admin**: `admin123`, `superadmin123`
- **Mentor**: `mentor123`
- **Student**: `student123`
- **Organizer**: `organizer123`
- **Company**: `company123`

## Testing Scenarios

### 1. Role-Based Access Testing
- Test login with each role type
- Verify role-specific dashboard access
- Test role-based API endpoints

### 2. Multi-User Testing
- Test interactions between different user types
- Verify mentor-student relationships
- Test organizer-event management
- Test company-project collaborations

### 3. Authentication Testing
- Test login/logout functionality
- Test password validation
- Test session management
- Test role-based redirects

## Database Operations

### Clear Existing Data
The seed script will clear all existing users before inserting new ones. If you want to keep existing data, modify the `seedUsers.ts` file and comment out the `User.deleteMany({})` line.

### Add More Users
To add more development users, edit the `developmentUsers` array in `backend/src/seed/seedUsers.ts` and run the seed script again.

## Environment Setup

Make sure you have the following environment variables set in your `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/edumentor
# or your MongoDB connection string
```

## Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Ensure MongoDB is running
   - Check your MONGODB_URI in .env file

2. **TypeScript Compilation Error**
   - Run `npm install` to ensure all dependencies are installed
   - Check that ts-node is available

3. **Permission Errors**
   - Ensure you have write permissions to the database
   - Check if the database user has proper roles

### Reset Database
To completely reset and reseed the database:
```bash
# Clear the database
mongo edumentor --eval "db.dropDatabase()"

# Run the seed script
npm run seed
```

## Security Note

⚠️ **IMPORTANT**: These credentials are for development purposes only. Never use these passwords in production environments. Always use strong, unique passwords for production users.

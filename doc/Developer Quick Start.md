# Developer Quick Start Guide

This guide provides instructions for developers who want to contribute to the EduMentor platform.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (v8 or higher) or yarn
- MongoDB (v5 or higher)
- Git
- Code editor (VS Code recommended)

## Repository Setup

1. Clone the repository:
```bash
git clone https://github.com/your-org/edumentor.git
cd edumentor
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Environment Configuration

1. Create a `.env` file in the backend directory:
```bash
cd backend
cp .env.example .env
```

2. Update the `.env` file with your configuration:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/edumentor
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

3. Create a `.env` file in the frontend directory:
```bash
cd ../frontend
cp .env.example .env
```

4. Update the frontend `.env` file:
```
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
```

## Database Setup

1. Ensure MongoDB is running:
```bash
mongod
```

2. (Optional) Seed the database with initial data:
```bash
cd backend
npm run seed
```

## Running the Application

### Backend Development Server
```bash
cd backend
npm run dev
```
The backend will be available at `http://localhost:3000`

### Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:5173`

## Project Structure Overview

### Backend (`/backend`)
```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API route definitions
├── services/        # Business logic
├── utils/           # Utility functions
└── server.ts        # Application entry point
```

### Frontend (`/frontend`)
```
src/
├── components/      # Reusable UI components
├── pages/           # Page components
├── services/        # API service layer
├── contexts/        # React context providers
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

## Development Workflow

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes following the coding standards

3. Run tests:
```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

4. Commit your changes:
```bash
git add .
git commit -m "Add feature: your feature description"
```

5. Push to your fork and create a pull request

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Enable strict type checking
- Provide meaningful type definitions
- Use interfaces for object structures

### Backend
- Follow RESTful API design principles
- Use proper error handling with try/catch blocks
- Implement input validation
- Use consistent response formats

### Frontend
- Use functional components with hooks
- Follow component composition patterns
- Implement proper error boundaries
- Use CSS modules or Tailwind classes for styling

## Testing

### Backend Testing
- Unit tests for services and utilities
- Integration tests for controllers
- End-to-end tests for critical workflows

### Frontend Testing
- Unit tests for components and hooks
- Integration tests for complex interactions
- End-to-end tests for user flows

Run tests with:
```bash
npm run test
npm run test:watch  # For development
npm run test:coverage  # To check coverage
```

## API Documentation

API documentation is available through Swagger at:
```
http://localhost:3000/api-docs
```

## Contributing Guidelines

1. Follow the existing code style
2. Write tests for new functionality
3. Update documentation when making changes
4. Ensure all tests pass before submitting a pull request
5. Use descriptive commit messages
6. Keep pull requests focused on a single feature or bug fix

## Getting Help

If you need help:
1. Check the existing documentation in the `/docs` directory
2. Review existing code for examples
3. Open an issue on GitHub for questions or bug reports
4. Join our developer community chat (link in README)

## Useful Commands

```bash
# Backend
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Check code style
npm run seed         # Seed database

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Check code style
npm run preview      # Preview production build
```

This guide should get you up and running with EduMentor development. Happy coding!
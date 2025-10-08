# Institution Dashboard Directory Structure

This document explains the organization of the Institution Dashboard components.

## Directory Structure

```
institution/
└── InstitutionDashboard/
    ├── components/                 # Reusable UI components
    │   ├── AccountForm.tsx         # Form for creating/editing accounts
    │   ├── AccountsTable.tsx       # Table displaying institution accounts
    │   ├── BulkUploadSection.tsx   # Section for bulk account creation
    │   ├── Pagination.tsx          # Pagination controls
    │   ├── SearchAndFilter.tsx     # Search and filter controls
    │   ├── StatsSection.tsx        # Statistics display section
    │   └── index.ts                # Component exports
    ├── InstitutionDashboard.new.tsx # Main dashboard component (new version)
    ├── InstitutionDashboard.hooks.ts # Custom hooks for data fetching
    ├── InstitutionDashboard.types.ts # TypeScript type definitions
    ├── InstitutionDashboardPage.tsx # Page wrapper component
    └── index.ts                    # Main export
```

## Component Responsibilities

### Main Components

1. **InstitutionDashboard.new.tsx** - Main dashboard component that orchestrates all other components
2. **InstitutionDashboard.hooks.ts** - Custom hooks for data fetching and state management
3. **InstitutionDashboard.types.ts** - TypeScript interfaces and types

### UI Components

1. **AccountForm.tsx** - Handles creation and editing of individual accounts
2. **AccountsTable.tsx** - Displays accounts in a tabular format with actions
3. **BulkUploadSection.tsx** - Manages bulk account creation functionality
4. **Pagination.tsx** - Handles pagination controls for account listings
5. **SearchAndFilter.tsx** - Provides search and filtering capabilities
6. **StatsSection.tsx** - Displays key metrics and statistics

## Backend Integration

The dashboard connects to the backend through:
- **institutionService.ts** - API service layer
- **InstitutionController.ts** - Backend controller handling requests

## Navigation

The dashboard is accessible at `/app/institution-dashboard` for users with the `institution` role.
// Main Institution Module Exports
export { InstitutionDashboard } from './InstitutionDashboard';
export { StudentManagement } from './StudentManagement';
export { TeacherManagement } from './TeacherManagement';
export { Settings as InstitutionSettings } from './Settings';

// Re-export sub-modules
export { InstitutionHackathonDashboard } from './HackathonManagement';
export { AnalyticsPage } from './Analytics';

// Re-export types and hooks from InstitutionDashboard
export { useInstitutionAccounts } from './InstitutionDashboard';
export type { 
  InstitutionUser, 
  AccountStats, 
  Pagination, 
  BulkUploadResult, 
  ExcelTemplateData 
} from './InstitutionDashboard';

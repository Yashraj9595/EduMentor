export interface InstitutionUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: 'student' | 'mentor';
  university?: string;
  major?: string;
  year?: string;
  studentId?: string;
  graduationYear?: string;
  department?: string; // For mentors
  bio?: string; // For mentors
  skills?: string[]; // For mentors
  isActive?: boolean;
  createdAt?: string;
}

export interface BulkUploadResult {
  success: boolean;
  message: string;
  data?: {
    created: number;
    errors: number;
    details: string[];
  };
}

export interface ExcelTemplateData {
  fileName: string;
  url: string;
}

export interface AccountStats {
  totalStudents: number;
  totalMentors: number;
  activeAccounts: number;
  recentAccounts: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
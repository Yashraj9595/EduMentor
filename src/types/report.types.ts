export interface ReportData {
  title: string;
  author: string;
  studentId: string;
  email: string;
  supervisor: string;
  supervisorTitle: string;
  department: string;
  university: string;
  city: string;
  country: string;
  date: string;
  degree: string;
  field: string;
  abstract: string;
  keywords: string[];
  sections: ReportSection[];
  template: string;
  format: string;
  citationStyle: string;
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  required: boolean;
  completed: boolean;
  wordCount: number;
  order: number;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: ReportSection[];
  format: 'legal' | 'academic' | 'business';
  citationStyle: 'bluebook' | 'apa' | 'mla' | 'oscola';
}

export interface ReportDraft {
  _id?: string;
  userId: string;
  title: string;
  data: string;
  template: string;
  format: string;
  citationStyle: string;
  createdAt: Date;
  updatedAt: Date;
}

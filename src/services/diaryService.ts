import { apiService } from './api';

export interface DiaryEntry {
  _id?: string;
  projectId: string;
  entryType: 'daily' | 'weekly' | 'milestone' | 'review';
  title: string;
  content: string;
  attachments: string[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  entryDate?: Date;
  mentorFeedback?: {
    comment: string;
    rating: number;
    submittedAt: Date;
  };
}

export interface DiaryEntryResponse {
  entries: DiaryEntry[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export class DiaryService {
  // Create a new diary entry
  static async createDiaryEntry(entryData: Omit<DiaryEntry, '_id' | 'entryDate' | 'mentorFeedback'>): Promise<any> {
    return apiService.post('/diary/entries', entryData);
  }

  // Get a single diary entry
  static async getDiaryEntry(entryId: string): Promise<any> {
    return apiService.get(`/diary/entries/single/${entryId}`);
  }

  // Get diary entries for a project
  static async getDiaryEntries(
    projectId: string, 
    page: number = 1, 
    limit: number = 10, 
    entryType?: string, 
    status?: string
  ): Promise<any> {
    let url = `/diary/entries/${projectId}?page=${page}&limit=${limit}`;
    if (entryType) url += `&entryType=${entryType}`;
    if (status) url += `&status=${status}`;
    
    return apiService.get(url);
  }

  // Update a diary entry
  static async updateDiaryEntry(
    entryId: string, 
    entryData: Partial<Omit<DiaryEntry, '_id' | 'entryDate' | 'mentorFeedback' | 'projectId'>>
  ): Promise<any> {
    return apiService.put(`/diary/entries/${entryId}`, entryData);
  }

  // Get project progress
  static async getProjectProgress(projectId: string): Promise<any> {
    return apiService.get(`/diary/progress/${projectId}`);
  }
}

export default DiaryService;
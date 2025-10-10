import { ReportData, ReportTemplate } from '../types/report.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export class ReportApiService {
  private static instance: ReportApiService;
  
  public static getInstance(): ReportApiService {
    if (!ReportApiService.instance) {
      ReportApiService.instance = new ReportApiService();
    }
    return ReportApiService.instance;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate report in specified format
   */
  async generateReport(data: ReportData, format: 'pdf' | 'docx' | 'html'): Promise<Blob | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, format }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error generating report:', error);
      return null;
    }
  }

  /**
   * Get available report templates
   */
  async getTemplates(): Promise<ReportTemplate[]> {
    const response = await this.makeRequest<ReportTemplate[]>('/reports/templates');
    return response.data || [];
  }

  /**
   * Get template by ID
   */
  async getTemplate(templateId: string): Promise<ReportTemplate | null> {
    const response = await this.makeRequest<ReportTemplate>(`/reports/templates/${templateId}`);
    return response.data || null;
  }

  /**
   * Save report draft
   */
  async saveDraft(data: ReportData, userId: string): Promise<{ success: boolean; draftId?: string }> {
    const response = await this.makeRequest<{ draftId: string }>('/reports/drafts', {
      method: 'POST',
      body: JSON.stringify({ data, userId }),
    });

    return {
      success: response.success,
      draftId: response.data?.draftId,
    };
  }

  /**
   * Load report draft
   */
  async loadDraft(draftId: string, userId: string): Promise<ReportData | null> {
    const response = await this.makeRequest<ReportData>(`/reports/drafts/${draftId}`, {
      method: 'GET',
      body: JSON.stringify({ userId }),
    });

    return response.data || null;
  }

  /**
   * Get user's report drafts
   */
  async getUserDrafts(userId: string): Promise<any[]> {
    const response = await this.makeRequest<any[]>(`/reports/drafts/user/${userId}`);
    return response.data || [];
  }

  /**
   * Delete report draft
   */
  async deleteDraft(draftId: string, userId: string): Promise<boolean> {
    const response = await this.makeRequest(`/reports/drafts/${draftId}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });

    return response.success;
  }

  /**
   * Validate report data
   */
  async validateReport(data: ReportData): Promise<{ isValid: boolean; errors: string[] }> {
    const response = await this.makeRequest<{ isValid: boolean; errors: string[] }>('/reports/validate', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });

    return response.data || { isValid: false, errors: [] };
  }

  /**
   * Get report statistics
   */
  async getReportStats(data: ReportData): Promise<any> {
    const response = await this.makeRequest<any>('/reports/stats', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });

    return response.data || {};
  }
}

export default ReportApiService;

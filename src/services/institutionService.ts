import apiService from './api';
import { InstitutionUser, BulkUploadResult } from '../pages/institution/InstitutionDashboard/InstitutionDashboard.types';
import { ApiResponse } from './api';

const INSTITUTION_API_PREFIX = '/institutions';

export const institutionService = {
  /**
   * Create a single account
   */
  createAccount: async (userData: Omit<InstitutionUser, 'id' | 'createdAt'>): Promise<ApiResponse<any>> => {
    const response = await apiService.post(`${INSTITUTION_API_PREFIX}/accounts`, userData);
    return response;
  },

  /**
   * Create bulk accounts from Excel file
   */
  createBulkAccounts: async (file: File): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Use direct fetch for file uploads to handle multipart form data correctly
    const token = localStorage.getItem('accessToken');
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    
    const response = await fetch(`${API_BASE_URL}${INSTITUTION_API_PREFIX}/accounts/bulk`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload file');
    }
    
    const data = await response.json();
    return data;
  },

  /**
   * Download Excel template
   */
  downloadTemplate: async (): Promise<Blob> => {
    // For downloading files, we need to use fetch directly to handle blob responses
    const token = localStorage.getItem('accessToken');
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    
    // Log request details for debugging
    console.log('Downloading template with token:', !!token);
    
    const response = await fetch(`${API_BASE_URL}${INSTITUTION_API_PREFIX}/template`, {
      method: 'GET',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    
    if (!response.ok) {
      // Try to parse error response
      let errorMessage = `Failed to download template: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.log('Template download error response:', errorData);
      } catch (e) {
        // If we can't parse JSON, use the status text
        console.log('Template download error (non-JSON response):', response.status, response.statusText);
      }
      
      // Provide more specific error message based on status code
      if (response.status === 403) {
        errorMessage += '. This functionality is only available to institution administrators.';
      }
      
      throw new Error(errorMessage);
    }
    
    return await response.blob();
  },

  /**
   * Get institution accounts with advanced filtering
   */
  getAccounts: async (params?: {
    page?: number;
    limit?: number;
    role?: 'student' | 'mentor';
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<any>> => {
    // Build query string
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.role) queryParams.append('role', params.role);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sort', params.sortBy);
    if (params?.sortOrder) queryParams.append('order', params.sortOrder);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await apiService.get(`${INSTITUTION_API_PREFIX}/accounts${queryString}`);
    return response;
  },

  /**
   * Update an existing account
   */
  updateAccount: async (id: string, userData: Partial<InstitutionUser>): Promise<ApiResponse<any>> => {
    const response = await apiService.put(`${INSTITUTION_API_PREFIX}/accounts/${id}`, userData);
    return response;
  },

  /**
   * Delete an account
   */
  deleteAccount: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiService.delete(`${INSTITUTION_API_PREFIX}/accounts/${id}`);
    return response;
  },

  /**
   * Activate an account
   */
  activateAccount: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiService.put(`${INSTITUTION_API_PREFIX}/accounts/${id}/activate`, {});
    return response;
  },

  /**
   * Deactivate an account
   */
  deactivateAccount: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiService.put(`${INSTITUTION_API_PREFIX}/accounts/${id}/deactivate`, {});
    return response;
  },

  /**
   * Get account statistics
   */
  getAccountStats: async (): Promise<ApiResponse<any>> => {
    const response = await apiService.get(`${INSTITUTION_API_PREFIX}/accounts/stats`);
    return response;
  }
};
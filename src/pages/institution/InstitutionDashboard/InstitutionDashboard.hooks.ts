import { useState, useCallback, useEffect } from 'react';
import { InstitutionUser, BulkUploadResult, AccountStats, Pagination } from './InstitutionDashboard.types';
import { useToast } from '../../../contexts/ToastContext';
import { institutionService } from '../../../services/institutionService';
import { ApiResponse } from '../../../services/api';

export const useInstitutionAccounts = () => {
  const [users, setUsers] = useState<InstitutionUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [stats, setStats] = useState<AccountStats>({
    totalStudents: 0,
    totalMentors: 0,
    activeAccounts: 0,
    recentAccounts: 0
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });
  const { showToast } = useToast();

  // Validate user data before submission
  const validateUserData = (userData: Partial<InstitutionUser>): string | null => {
    if (!userData.firstName || userData.firstName.length < 2) {
      return 'First name must be at least 2 characters';
    }
    
    if (!userData.lastName || userData.lastName.length < 2) {
      return 'Last name must be at least 2 characters';
    }
    
    if (!userData.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(userData.email)) {
      return 'Please enter a valid email address';
    }
    
    if (!userData.mobile || !/^\+?[1-9]\d{1,14}$/.test(userData.mobile)) {
      return 'Please enter a valid mobile number';
    }
    
    if (!userData.role || (userData.role !== 'student' && userData.role !== 'mentor')) {
      return 'Role must be either student or mentor';
    }
    
    return null;
  };

  // Fetch account statistics
  const fetchStats = useCallback(async () => {
    try {
      const response: ApiResponse<any> = await institutionService.getAccountStats();
      if (response.success && response.data) {
        setStats({
          totalStudents: response.data.studentUsers || 0,
          totalMentors: response.data.mentorUsers || 0,
          activeAccounts: response.data.activeUsers || 0,
          recentAccounts: response.data.recentUsers || 0
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch account stats:', error);
      showToast({ 
        type: 'error', 
        title: 'Failed to fetch statistics', 
        message: error.message || 'Could not load account statistics' 
      });
    }
  }, [showToast]);

  // Fetch accounts with pagination and filtering
  const fetchAccounts = useCallback(async (params?: {
    page?: number;
    limit?: number;
    role?: 'student' | 'mentor';
    search?: string;
  }) => {
    setLoading(true);
    try {
      const response: ApiResponse<any> = await institutionService.getAccounts(params);
      
      if (response.success && response.data) {
        setUsers(response.data.accounts || []);
        setPagination({
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch accounts:', error);
      showToast({ 
        type: 'error', 
        title: 'Failed to fetch accounts', 
        message: error.message || 'Could not load accounts' 
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Create a single user account
  const createAccount = useCallback(async (userData: InstitutionUser) => {
    const validationError = validateUserData(userData);
    if (validationError) {
      showToast({ type: 'error', title: 'Validation Error', message: validationError });
      return { success: false, error: validationError };
    }

    setLoading(true);
    try {
      const response: ApiResponse<any> = await institutionService.createAccount(userData);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      const newUser = {
        ...userData,
        id: response.data.user.id,
        createdAt: new Date().toISOString()
      };
      
      setUsers(prev => [newUser, ...prev]);
      showToast({ type: 'success', title: 'Account created successfully' });
      
      // Refresh stats
      fetchStats();
      
      return { success: true, data: newUser };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create account';
      showToast({ type: 'error', title: 'Failed to create account', message: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [showToast, fetchStats]);

  // Create bulk accounts from Excel file
  const createBulkAccounts = useCallback(async (file: File) => {
    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];
    
    if (!validTypes.includes(file.type) && 
        !file.name.endsWith('.xlsx') && 
        !file.name.endsWith('.xls') && 
        !file.name.endsWith('.csv')) {
      const errorMessage = 'Invalid file type. Please upload an Excel or CSV file.';
      showToast({ type: 'error', title: 'Invalid File', message: errorMessage });
      return { success: false, message: errorMessage };
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      const errorMessage = 'File size exceeds 5MB limit. Please upload a smaller file.';
      showToast({ type: 'error', title: 'File Too Large', message: errorMessage });
      return { success: false, message: errorMessage };
    }

    setBulkLoading(true);
    try {
      const response: ApiResponse<any> = await institutionService.createBulkAccounts(file);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      // Show detailed results
      if (response.data) {
        const message = `Created: ${response.data.created} accounts. Errors: ${response.data.errors}.`;
        showToast({ 
          type: response.data.errors > 0 ? 'warning' : 'success', 
          title: response.message || 'Bulk upload completed', 
          message 
        });
        
        // Show detailed error information if any
        if (response.data.errorDetails && response.data.errorDetails.length > 0) {
          response.data.errorDetails.forEach((detail: string) => {
            showToast({ 
              type: 'info', 
              title: 'Upload Detail', 
              message: detail 
            });
          });
        }
        
        const result: BulkUploadResult = {
          success: response.success,
          message: response.message,
          data: {
            created: response.data.created,
            errors: response.data.errors,
            details: response.data.errorDetails || []
          }
        };
        
        // Refresh accounts and stats
        fetchAccounts();
        fetchStats();
        
        return result;
      } else {
        showToast({ 
          type: 'success', 
          title: response.message || 'Bulk upload completed successfully' 
        });
        return { success: true, message: response.message };
      }
    } catch (error: any) {
      let errorMessage = error.response?.data?.message || error.message || 'Failed to process bulk upload';
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        errorMessage = `Validation failed:\n${validationErrors.join('\n')}`;
      }
      
      showToast({ type: 'error', title: 'Failed to process bulk upload', message: errorMessage });
      return { success: false, message: errorMessage };
    } finally {
      setBulkLoading(false);
    }
  }, [showToast, fetchAccounts, fetchStats]);

  // Download Excel template
  const downloadTemplate = useCallback(async () => {
    try {
      const blob = await institutionService.downloadTemplate();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'institution_accounts_template.xlsx');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showToast({ type: 'success', title: 'Template downloaded successfully' });
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to download template';
      console.error('Download template error:', error);
      
      // Provide more detailed error information
      let detailedMessage = errorMessage;
      if (error.response?.status === 403) {
        detailedMessage += ' This functionality is only available to institution administrators. Please contact your system administrator if you believe you should have access.';
      }
      
      showToast({ type: 'error', title: 'Failed to download template', message: detailedMessage });
      return { success: false, error: errorMessage };
    }
  }, [showToast]);

  // Update an account
  const updateAccount = useCallback(async (id: string, userData: Partial<InstitutionUser>) => {
    setLoading(true);
    try {
      const response: ApiResponse<any> = await institutionService.updateAccount(id, userData);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      // Update the user in the local state
      setUsers(prev => prev.map(user => 
        user.id === id ? { ...user, ...userData } : user
      ));
      
      showToast({ type: 'success', title: 'Account updated successfully' });
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update account';
      showToast({ type: 'error', title: 'Failed to update account', message: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Delete an account
  const deleteAccount = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response: ApiResponse<any> = await institutionService.deleteAccount(id);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      // Remove the user from the local state
      setUsers(prev => prev.filter(user => user.id !== id));
      
      showToast({ type: 'success', title: 'Account deleted successfully' });
      
      // Refresh stats
      fetchStats();
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete account';
      showToast({ type: 'error', title: 'Failed to delete account', message: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [showToast, fetchStats]);

  // Activate an account
  const activateAccount = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response: ApiResponse<any> = await institutionService.activateAccount(id);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      // Update the user in the local state
      setUsers(prev => prev.map(user => 
        user.id === id ? { ...user, isActive: true } : user
      ));
      
      showToast({ type: 'success', title: 'Account activated successfully' });
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to activate account';
      showToast({ type: 'error', title: 'Failed to activate account', message: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Deactivate an account
  const deactivateAccount = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response: ApiResponse<any> = await institutionService.deactivateAccount(id);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      // Update the user in the local state
      setUsers(prev => prev.map(user => 
        user.id === id ? { ...user, isActive: false } : user
      ));
      
      showToast({ type: 'success', title: 'Account deactivated successfully' });
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to deactivate account';
      showToast({ type: 'error', title: 'Failed to deactivate account', message: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Load initial data
  useEffect(() => {
    fetchAccounts();
    fetchStats();
  }, [fetchAccounts, fetchStats]);

  return {
    users,
    loading,
    bulkLoading,
    stats,
    pagination,
    createAccount,
    createBulkAccounts,
    downloadTemplate,
    updateAccount,
    deleteAccount,
    activateAccount,
    deactivateAccount,
    fetchAccounts,
    fetchStats
  };
};
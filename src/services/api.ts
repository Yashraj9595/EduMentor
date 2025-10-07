import { User, } from '../types/auth.types';

// API Configuration and Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface OTPVerificationResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// API Service Class
class ApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Get auth token from localStorage
  private getAuthToken(): string | null {
    const token = localStorage.getItem('accessToken');
    console.log('Retrieved access token from localStorage:', !!token);
    return token;
  }

  // Get refresh token from localStorage
  private getRefreshToken(): string | null {
    const token = localStorage.getItem('refreshToken');
    console.log('Retrieved refresh token from localStorage:', !!token);
    return token;
  }

  // Set auth tokens
  private setAuthTokens(accessToken: string, refreshToken: string): void {
    console.log('Setting auth tokens');
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Clear auth tokens
  private clearAuthTokens(): void {
    console.log('Clearing auth tokens');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Make HTTP request
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      let response = await fetch(url, config);
      let data = await response.json();

      console.log(`API Request to ${endpoint}:`, { 
        status: response.status, 
        tokenPresent: !!token,
        hasAuthHeader: !!(config.headers && (config.headers as Record<string, string>)['Authorization'])
      });

      // If we get a 401, try to refresh the token
      if (response.status === 401 && token) {
        console.log('Received 401, attempting to refresh token...');
        try {
          const refreshResult = await this.refreshToken();
          console.log('Token refresh successful, retrying original request with new token...');
          // Retry the original request with the new token
          const retryConfig: RequestInit = {
            ...options,
            headers: {
              ...this.defaultHeaders,
              Authorization: `Bearer ${refreshResult.accessToken}`,
              ...options.headers,
            },
          };
          
          console.log('Retry config:', {
            method: retryConfig.method,
            hasAuthHeader: !!(retryConfig.headers && (retryConfig.headers as Record<string, string>)['Authorization']),
            authHeaderValue: (retryConfig.headers as Record<string, string>)['Authorization']
          });
          
          response = await fetch(url, retryConfig);
          data = await response.json();
          console.log('Retry request result:', { status: response.status, data });
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // If refresh fails, clear tokens and redirect to login
          this.clearAuthTokens();
          this.clearCurrentUser();
          window.location.href = '/login';
          throw new Error('Session expired. Please log in again.');
        }
      }

      if (!response.ok) {
        console.error('API request failed:', { 
          endpoint, 
          status: response.status, 
          data 
        });
        // Include validation errors in the error message if available
        const errorMessage = data.message || 'Request failed';
        const errorDetails = data.errors ? `: ${JSON.stringify(data.errors)}` : '';
        throw new Error(errorMessage + errorDetails);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Auth API Methods
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      this.setAuthTokens(response.data.token, response.data.refreshToken);
    }

    return response.data!;
  }

  async register(userData: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    mobile: string;
    role: string;
    acceptedTerms: boolean;
  }): Promise<RegisterResponse> {
    const response = await this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data) {
      this.setAuthTokens(response.data.token, response.data.refreshToken);
    }

    return response.data!;
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const response = await this.request<ForgotPasswordResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    return response.data!;
  }

  async verifyOTP(email: string, otp: string, type: string = 'email_verification'): Promise<OTPVerificationResponse> {
    const response = await this.request<OTPVerificationResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, type }),
    });

    return response.data!;
  }

  async resetPassword(email: string, otp: string, newPassword: string, confirmPassword: string): Promise<ResetPasswordResponse> {
    const response = await this.request<ResetPasswordResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
    });

    return response.data!;
  }

  async getProfile(): Promise<any> {
    const response = await this.request<any>('/auth/profile', {
      method: 'GET',
    });

    return response.data!;
  }

  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    mobile?: string;
  }): Promise<any> {
    const response = await this.request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });

    return response.data!;
  }

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<any> {
    const response = await this.request<any>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });

    return response.data!;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthTokens();
    }
  }

  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    console.log('Attempting to refresh token...');
    
    // Direct fetch without using the generic request method to avoid infinite loop
    const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();
    console.log('Refresh token response:', data);

    if (!response.ok) {
      console.error('Refresh token failed:', data.message || 'Unknown error');
      throw new Error(data.message || 'Failed to refresh token');
    }

    if (data.success && data.data) {
      console.log('Token refresh successful, updating tokens');
      console.log('New access token:', data.data.token);
      console.log('New refresh token:', data.data.refreshToken);
      this.setAuthTokens(data.data.token, data.data.refreshToken);
      return {
        accessToken: data.data.token,
        refreshToken: data.data.refreshToken
      };
    }

    throw new Error(data.message || 'Failed to refresh token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Get current user from token (if needed)
  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Set current user
  setCurrentUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Clear current user
  clearCurrentUser(): void {
    localStorage.removeItem('user');
  }

  // Generic GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET'
    });
  }

  // Generic POST request
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Generic PUT request
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Generic DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE'
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;

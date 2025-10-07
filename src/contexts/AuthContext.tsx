import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  LoginData, 
  RegisterData, 
  AuthContextType,
  ForgotPasswordData,
  OTPVerificationData,
  ResetPasswordData
} from '../types/auth.types';
import { apiService } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use toast context with error handling
  let showSuccess: (title: string, message?: string, duration?: number) => void;
  let showError: (title: string, message?: string, duration?: number) => void;
  let showWarning: (title: string, message?: string, duration?: number) => void;
  
  try {
    const toastContext = useToast();
    showSuccess = toastContext.showSuccess;
    showError = toastContext.showError;
    showWarning = toastContext.showWarning;
  } catch (error) {
    // Fallback functions if toast context is not available
    showSuccess = () => {};
    showError = () => {};
    showWarning = () => {};
  }

  useEffect(() => {
    // Check if user is authenticated and restore user data
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        // First, try to get user from localStorage
        const storedUser = apiService.getCurrentUser();
        console.log('Stored user:', storedUser);
        
        if (storedUser) {
          setUser(storedUser);
          setIsLoading(false);
          return;
        }

        // If no stored user but we have tokens, try to get profile
        if (apiService.isAuthenticated()) {
          console.log('User has auth token, fetching profile...');
          try {
            const userData = await apiService.getProfile();
            console.log('Profile fetched:', userData);
            setUser(userData);
            apiService.setCurrentUser(userData);
          } catch (error) {
            console.log('Profile fetch failed, trying to refresh token...', error);
            // If profile fetch fails, try to refresh token
            try {
              await apiService.refreshToken();
              const userData = await apiService.getProfile();
              setUser(userData);
              apiService.setCurrentUser(userData);
            } catch (refreshError) {
              console.log('Token refresh failed, clearing auth...', refreshError);
              // If refresh also fails, clear everything
              throw refreshError;
            }
          }
        } else {
          console.log('No auth token found');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid tokens and user data
        apiService.clearCurrentUser();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginData): Promise<void> => {
    try {
      const response = await apiService.login(data.email, data.password);
      
      setUser(response.user);
      apiService.setCurrentUser(response.user);
      
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      showSuccess('Login Successful', `Welcome back, ${response.user.firstName}!`);
    } catch (error: any) {
      showError('Login Failed', error.message || 'Please check your credentials and try again.');
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      if (data.password !== data.confirmPassword) {
        showError('Registration Failed', 'Passwords do not match');
        throw new Error('Passwords do not match');
      }

      if (!data.acceptedTerms) {
        showError('Registration Failed', 'You must accept the terms and conditions');
        throw new Error('You must accept the terms and conditions');
      }

      const response = await apiService.register({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        mobile: data.mobile,
        role: data.role,
        acceptedTerms: data.acceptedTerms,
      });
      
      // Don't set user as logged in - they need to verify OTP first
      // Store email for OTP verification
      sessionStorage.setItem('registrationEmail', data.email);
      sessionStorage.setItem('userData', JSON.stringify(response.user));
      
      showSuccess('Registration Successful', 'Please check your email for verification code');
    } catch (error: any) {
      showError('Registration Failed', error.message || 'Please try again.');
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      showSuccess('Logged Out', 'You have been successfully logged out');
    } catch (error) {
      console.error('Logout error:', error);
      showWarning('Logout Warning', 'There was an issue logging out, but you have been signed out locally');
    } finally {
      setUser(null);
      apiService.clearCurrentUser();
      localStorage.removeItem('rememberMe');
    }
  };

  const forgotPassword = async (data: ForgotPasswordData): Promise<void> => {
    try {
      await apiService.forgotPassword(data.email);
      
      // Store email temporarily for OTP verification
      sessionStorage.setItem('resetEmail', data.email);
      showSuccess('OTP Sent', 'Password reset code has been sent to your email');
    } catch (error: any) {
      showError('Failed to Send OTP', error.message || 'Please try again.');
      throw new Error(error.message || 'Failed to send OTP. Please try again.');
    }
  };

  const verifyOTP = async (data: OTPVerificationData): Promise<boolean> => {
    try {
      // Determine OTP type based on context
      const type = data.isRegistration ? 'email_verification' : 'password_reset';
      await apiService.verifyOTP(data.email, data.otp, type);
      
      if (data.isRegistration) {
        showSuccess('Email Verified', 'Your email has been successfully verified');
      } else {
        showSuccess('OTP Verified', 'You can now reset your password');
      }
      return true;
    } catch (error: any) {
      showError('Invalid OTP', error.message || 'Please check the code and try again.');
      throw new Error(error.message || 'Invalid OTP. Please try again.');
    }
  };

  const resetPassword = async (data: ResetPasswordData): Promise<void> => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        showError('Password Mismatch', 'Passwords do not match');
        throw new Error('Passwords do not match');
      }

      await apiService.resetPassword(data.email, data.otp, data.newPassword, data.confirmPassword);
      
      // Clear the stored email
      sessionStorage.removeItem('resetEmail');
      showSuccess('Password Reset', 'Your password has been successfully reset');
    } catch (error: any) {
      showError('Password Reset Failed', error.message || 'Please try again.');
      throw new Error(error.message || 'Password reset failed. Please try again.');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    verifyOTP,
    resetPassword,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

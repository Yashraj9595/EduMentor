import { Request } from 'express';

export interface IUser {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  role: UserRole;
  password: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  // Student-specific fields
  university?: string;
  major?: string;
  year?: string;
  gpa?: string;
  studentId?: string;
  graduationYear?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
  // Mentor-specific fields
  department?: string;
}

export type UserRole = 'admin' | 'mentor' | 'student' | 'organizer' | 'company' | 'institution';

export interface IOTP {
  _id?: string;
  email: string;
  mobile?: string;
  otp: string;
  type: OTPType;
  expiresAt: Date;
  isUsed: boolean;
  attempts: number;
  createdAt?: Date;
}

export type OTPType = 'email_verification' | 'password_reset' | 'mobile_verification' | 'login';

export interface IAuthRequest extends Request {
  user?: IUser;
  body: any;
  params: any;
  query: any;
  headers: any;
}

export interface ILoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IRegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  mobile: string;
  role: UserRole;
  acceptedTerms: boolean;
}

export interface IForgotPasswordData {
  email: string;
}

export interface IOTPVerificationData {
  email: string;
  otp: string;
  type?: OTPType;
}

export interface IResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IUpdateProfileData {
  firstName?: string;
  lastName?: string;
  mobile?: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: Partial<IUser>;
    token: string;
    refreshToken?: string;
  };
}

export interface IOTPResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    expiresAt: Date;
  };
}

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface IUserQuery extends IPaginationQuery {
  role?: UserRole;
  isActive?: boolean;
  search?: string;
}

export interface IEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface IOTPEmailData {
  otp: string;
  expiresIn: string;
  type: string;
}

export interface IRateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
}

export interface IError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export interface IProject {
  _id?: string;
  title: string;
  description: string;
  longDescription?: string;
  category?: string;
  technologies: string[];
  studentId: string;
  mentorId?: string;
  status: 'draft' | 'submitted' | 'in_progress' | 'under_review' | 'completed' | 'archived';
  startDate: Date;
  endDate: Date;
  deliverables: string[];
  milestones: IMilestone[];
  tags: string[];
  problemStatement?: string;
  repositoryLink?: string;
  liveUrl?: string;
  documentationUrl?: string;
  videoUrl?: string;
  teamMembers: ITeamMember[];
  thumbnail?: string;
  objectives?: string[];
  challenges?: string[];
  achievements?: string[];
  gallery?: Array<{
    id: string;
    url: string;
    type: 'image' | 'video';
    caption?: string;
  }>;
  metrics?: {
    views: number;
    likes: number;
    comments: number;
    bookmarks: number;
  };
  featured?: boolean;
  awards?: Array<{
    title: string;
    organization: string;
    date: Date;
    description: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITeamMember {
  email: string;
  role: string;
}

export interface IMilestone {
  _id?: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: Date;
}

export interface INotification {
  _id?: string;
  title: string;
  message: string;
  userId: string;
  senderId?: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'mentor_request' | 'project_update';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  relatedProjectId?: string;
  relatedEntityId?: string;
  relatedEntityType?: 'project' | 'mentor_request' | 'diary' | 'review';
  createdAt?: Date;
  updatedAt?: Date;
}

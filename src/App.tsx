import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { MainLayout } from './components/layout/MainLayout';

// Public pages
import { LandingPage } from './pages/auth/LandingPage/LandingPage';
import { SelectRole } from './pages/auth/SelectRole/SelectRole';

// Auth pages
import { Login } from './pages/auth/Login/Login';
import { Register } from './pages/auth/Register/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword/ForgotPassword';
import { VerifyOTP } from './pages/auth/VerifyOTP/VerifyOTP';
import { ResetPassword } from './pages/auth/ResetPassword/ResetPassword';
import { RegistrationSuccess } from './pages/auth/RegistrationSuccess/RegistrationSuccess';

// App pages
import { AdminDashboard } from './pages/admin/AdminDashboard/AdminDashboard';
import { MentorDashboard } from './pages/mentor/MentorDashboard';
import { MentorProfile } from './pages/mentor/MentorProfile';
import { ProblemStatementManager } from './pages/mentor/ProblemStatements';
import { HackathonDashboard } from './pages/organizer/HackathonDashboard';
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import { 
  InstitutionDashboard, 
  StudentManagement, 
  TeacherManagement,
  AnalyticsPage as InstitutionAnalytics,
  InstitutionHackathonDashboard,
  InstitutionSettings
} from './pages/institution';
import { Analytics } from './pages/admin/Analytics/Analytics';
import { Reports } from './pages/admin/Reports/Reports';
import { Settings as AdminSettings } from './pages/admin/Settings/Settings';
// User pages - these are handled within the Settings page components
import { ToastTest } from './pages/ToastTest';
import { ThemeDemo } from './pages/ThemeDemo';

// Student pages
import { StudentDashboard } from './pages/student/Dashboard';
import { CreateProject, EditProject, ProjectList, ProjectDetail } from './pages/Projects';
import { MentorList, MentorChat } from './pages/student/Mentors';
import { TeamFormation, TeamChat } from './pages/student/Teams';
import { 
  HackathonList as StudentHackathonList,
  HackathonDetail,
  HackathonRegistration,
  HackathonSubmission as StudentHackathonSubmission
} from './pages/student/Hackathons';
import { StudentProfile } from './pages/student/Profile';
import { ExploreProjects, ExploreProjectDetail } from './pages/ExploreProjects/Explore';
import Settings from './pages/student/Settings';

// Chat page
import { Chat } from './pages/chat';

// Notifications page
import { NotificationsPage } from './pages/Notifications';

// Advanced Features
import { AchievementSystem } from './pages/ExploreProjects/Gamification/AchievementSystem';
import { FeatureAccessGuide } from './pages/ExploreProjects/FeatureGuide/FeatureAccessGuide';

// Diary Management System
import { ProjectDiary, ProjectProgress, CreateDiaryEntry, EditDiaryEntry } from './pages/student/Diary';
import { MentorDiaryDashboard } from './pages/mentor/DiaryManagement';
import ProjectDiaryView from './pages/mentor/DiaryManagement/ProjectDiaryView';
import { ReviewScheduler } from './pages/mentor/ReviewSystem';
import { AdminDiaryMonitor } from './pages/admin/DiaryMonitoring';

// Report Generation System
import { ReportGeneration } from './pages/student/ReportGeneration';
import { ReportGenerator } from './pages/ProjectReport/ReportGenerator';
import { ReportTemplates } from './pages/ProjectReport/ReportTemplates';
import { ReportHistory } from './pages/ProjectReport/ReportHistory';
import { StudentDashboard as NewStudentDashboard } from './pages/student/StudentDashboard';

// Hackathon Management System
import { CreateHackathon, TeamManagement, JudgingSystem, AnalyticsDashboard } from './pages/organizer/HackathonManagement';


// Role-based redirect component
const RoleBasedRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect based on user role
  switch (user.role) {
    case 'admin':
      return <Navigate to="/app/dashboard" replace />;
    case 'mentor':
      return <Navigate to="/app/mentor-dashboard" replace />;
    case 'organizer':
      return <Navigate to="/app/hackathon-dashboard" replace />;
    case 'company':
      return <Navigate to="/app/company-dashboard" replace />;
    case 'institution':
      return <Navigate to="/app/institution-dashboard" replace />;
    case 'student':
      return <Navigate to="/app/user-dashboard" replace />;
    default:
      return <Navigate to="/app/user-dashboard" replace />;
  }
};

function App() {
  return (
    <BrowserRouter future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <NotificationProvider>
              <div className="w-full max-w-full overflow-x-hidden">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
                  <Route path="/select-role" element={<PublicRoute><SelectRole /></PublicRoute>} />
                  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                  <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                  <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                  <Route path="/verify-otp" element={<PublicRoute><VerifyOTP /></PublicRoute>} />
                  <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
                  <Route path="/registration-success" element={<PublicRoute><RegistrationSuccess /></PublicRoute>} />
                  <Route path="/toast-test" element={<PublicRoute><ToastTest /></PublicRoute>} />
                  <Route path="/theme-demo" element={<PublicRoute><ThemeDemo /></PublicRoute>} />

                  {/* Protected routes */}
                  <Route
                    path="/app"
                    element={
                      <ProtectedRoute>
                        <MainLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<RoleBasedRedirect />} />
                    
                    {/* Admin Dashboard */}
                    <Route 
                      path="dashboard" 
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Admin Diary Monitoring */}
                    <Route 
                      path="diary-monitor" 
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminDiaryMonitor />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* User Dashboard */}
                    <Route 
                      path="user-dashboard" 
                      element={
                        <ProtectedRoute allowedRoles={['student']}>
                          <StudentDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Mentor Dashboard */}
                    <Route 
                      path="mentor-dashboard" 
                      element={
                        <ProtectedRoute allowedRoles={['mentor']}>
                          <MentorDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Mentor Profile */}
                    <Route 
                      path="mentor-profile" 
                      element={
                        <ProtectedRoute allowedRoles={['mentor']}>
                          <MentorProfile />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Mentor Profile for specific mentor (for students to view) */}
                    <Route 
                      path="mentors/:mentorId/profile" 
                      element={
                        <ProtectedRoute allowedRoles={['student', 'mentor']}>
                          <MentorProfile />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Mentor Diary Management */}
                    <Route 
                      path="mentor-diary" 
                      element={
                        <ProtectedRoute allowedRoles={['mentor']}>
                          <MentorDiaryDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="mentor-diary/project/:projectId" 
                      element={
                        <ProtectedRoute allowedRoles={['mentor']}>
                          <ProjectDiaryView />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Mentor Review System */}
                    <Route 
                      path="mentor-reviews" 
                      element={
                        <ProtectedRoute allowedRoles={['mentor']}>
                          <ReviewScheduler />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Mentor Problem Statements */}
                    <Route 
                      path="mentor-problems" 
                      element={
                        <ProtectedRoute allowedRoles={['mentor']}>
                          <ProblemStatementManager />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Hackathon Organizer Dashboard */}
                    <Route 
                      path="hackathon-dashboard" 
                      element={
                        <ProtectedRoute allowedRoles={['organizer']}>
                          <HackathonDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Organizer Hackathon Management Routes */}
                    <Route 
                      path="organizer/hackathons" 
                      element={
                        <ProtectedRoute allowedRoles={['organizer']}>
                          <HackathonDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="organizer/hackathons/create" 
                      element={
                        <ProtectedRoute allowedRoles={['organizer']}>
                          <CreateHackathon />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="organizer/hackathons/teams" 
                      element={
                        <ProtectedRoute allowedRoles={['organizer']}>
                          <TeamManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="organizer/hackathons/judging" 
                      element={
                        <ProtectedRoute allowedRoles={['organizer']}>
                          <JudgingSystem />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="organizer/hackathons/analytics" 
                      element={
                        <ProtectedRoute allowedRoles={['organizer']}>
                          <AnalyticsDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Company Dashboard */}
                    <Route 
                      path="company-dashboard" 
                      element={
                        <ProtectedRoute allowedRoles={['company']}>
                          <CompanyDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Institution Dashboard */}
                    <Route 
                      path="institution-dashboard" 
                      element={
                        <ProtectedRoute allowedRoles={['institution']}>
                          <InstitutionDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="institution-dashboard/students" 
                      element={
                        <ProtectedRoute allowedRoles={['institution']}>
                          <StudentManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="institution-dashboard/teachers" 
                      element={
                        <ProtectedRoute allowedRoles={['institution']}>
                          <TeacherManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="institution-dashboard/analytics" 
                      element={
                        <ProtectedRoute allowedRoles={['institution']}>
                          <InstitutionAnalytics />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="institution-dashboard/hackathons" 
                      element={
                        <ProtectedRoute allowedRoles={['institution']}>
                          <InstitutionHackathonDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="institution-dashboard/hackathons/create" 
                      element={
                        <ProtectedRoute allowedRoles={['institution']}>
                          <InstitutionHackathonDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="institution-dashboard/hackathons/teams" 
                      element={
                        <ProtectedRoute allowedRoles={['institution']}>
                          <InstitutionHackathonDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="institution-dashboard/hackathons/judging" 
                      element={
                        <ProtectedRoute allowedRoles={['institution']}>
                          <InstitutionHackathonDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="institution-dashboard/hackathons/analytics" 
                      element={
                        <ProtectedRoute allowedRoles={['institution']}>
                          <InstitutionHackathonDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="institution-dashboard/settings" 
                      element={
                        <ProtectedRoute allowedRoles={['institution']}>
                          <InstitutionSettings />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* User Projects */}
                    <Route 
                      path="projects" 
                      element={
                        <ProtectedRoute allowedRoles={['student', 'mentor']}>
                          <ProjectList />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Admin-only routes */}
                    <Route 
                      path="analytics" 
                      element={
                        <ProtectedRoute allowedRoles={['admin', 'mentor']}>
                          <Analytics />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="reports" 
                      element={
                        <ProtectedRoute allowedRoles={['admin', 'mentor']}>
                          <Reports />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="admin-settings" 
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminSettings />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="user-settings" 
                      element={
                        <ProtectedRoute allowedRoles={['student', 'mentor', 'organizer', 'company']}>
                          <Settings />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Chat Route - Available for all roles */}
                    <Route 
                      path="chat" 
                      element={
                        <ProtectedRoute allowedRoles={['student', 'mentor', 'organizer', 'company', 'admin']}>
                          <Chat />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* User routes - redirect to user-settings for now */}
                    <Route 
                      path="profile" 
                      element={
                        <ProtectedRoute allowedRoles={['student', 'mentor']}>
                          <Navigate to="/app/user-settings" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="profile/edit" 
                      element={
                        <ProtectedRoute allowedRoles={['student', 'mentor']}>
                          <Navigate to="/app/user-settings" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="security" 
                      element={
                        <ProtectedRoute allowedRoles={['student', 'mentor']}>
                          <Navigate to="/app/user-settings" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="notifications" 
                      element={
                        <ProtectedRoute allowedRoles={['student', 'mentor']}>
                          <Navigate to="/app/user-settings" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="preferences" 
                      element={
                        <ProtectedRoute allowedRoles={['student', 'mentor']}>
                          <Navigate to="/app/user-settings" replace />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="view-profile" 
                      element={
                        <ProtectedRoute allowedRoles={['student', 'mentor']}>
                          <Navigate to="/app/user-settings" replace />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Student Routes */}
                    <Route 
                      path="student" 
                      element={
                        <ProtectedRoute allowedRoles={['student']}>
                          <Outlet />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<NewStudentDashboard />} />
                      <Route path="dashboard" element={<NewStudentDashboard />} />
                      
                      {/* Project Routes */}
                      <Route path="projects" element={<ProjectList />} />
                      <Route path="projects/create" element={<CreateProject />} />
                      <Route path="projects/:id" element={<ProjectDetail />} />
                      <Route path="projects/:id/edit" element={<EditProject />} />
                      
                      {/* Explore Routes */}
                      <Route path="explore" element={<ExploreProjects />} />
                      <Route path="explore/:id" element={<ExploreProjectDetail />} />
                      
                      {/* Mentor Routes */}
                      <Route path="mentors" element={<MentorList />} />
                      <Route path="mentors/:mentorId/chat" element={<MentorChat />} />
                      <Route path="mentors/:mentorId/profile" element={<MentorProfile />} />
                      
                      {/* Team Routes */}
                      <Route path="teams/create" element={<TeamFormation />} />
                      <Route path="teams/:teamId/chat" element={<TeamChat />} />
                      
                    {/* Student Hackathon Routes */}
                    <Route path="hackathons" element={<StudentHackathonList />} />
                    <Route path="hackathons/:id" element={<HackathonDetail />} />
                    <Route path="hackathons/:id/register" element={<HackathonRegistration />} />
                    <Route path="hackathons/:id/submit" element={<StudentHackathonSubmission />} />
                      
                      {/* Profile Routes */}
                      <Route path="profile" element={<StudentProfile />} />
                      
                      {/* Notifications Route */}
                      <Route path="notifications" element={<NotificationsPage />} />
                      
                      {/* Diary Management */}
                      <Route path="diary" element={<ProjectDiary />} />
                      <Route path="diary/:projectId" element={<ProjectDiary />} />
                      <Route path="diary/:projectId/new" element={<CreateDiaryEntry />} />
                      <Route path="diary/:projectId/edit/:entryId" element={<EditDiaryEntry />} />
                      <Route path="progress/:projectId" element={<ProjectProgress />} />
                      
                      {/* Advanced Features */}
                      <Route path="achievements" element={<AchievementSystem />} />
                      <Route path="features" element={<FeatureAccessGuide />} />
                      
                      {/* Report Generation */}
                      <Route path="report-generation" element={<ReportGeneration />} />
                    </Route>
                  </Route>

                  {/* Report Generation Routes (Standalone) */}
                  <Route path="/project-report" element={<ReportGenerator />} />
                  <Route path="/project-report/templates" element={<ReportTemplates />} />
                  <Route path="/project-report/history" element={<ReportHistory />} />

                  {/* Catch all - redirect to landing */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </NotificationProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
}

export default App;
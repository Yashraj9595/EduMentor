import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
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
import { HackathonDashboard } from './pages/organizer/HackathonDashboard';
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import { InstitutionDashboard } from './pages/institution/InstitutionDashboard';
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
import { HackathonList, HackathonSubmission } from './pages/organizer/Hackathons';
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
import { ProjectDiary, ProjectProgress } from './pages/student/Diary';
import { MentorDiaryDashboard } from './pages/mentor/DiaryManagement';
import { ReviewScheduler } from './pages/mentor/ReviewSystem';
import { AdminDiaryMonitor } from './pages/admin/DiaryMonitoring';

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
                  
                  {/* Mentor Diary Management */}
                  <Route 
                    path="mentor-diary" 
                    element={
                      <ProtectedRoute allowedRoles={['mentor']}>
                        <MentorDiaryDashboard />
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
                  
                  {/* Hackathon Organizer Dashboard */}
                  <Route 
                    path="hackathon-dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['organizer']}>
                        <HackathonDashboard />
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
                    <Route index element={<StudentDashboard />} />
                    <Route path="dashboard" element={<StudentDashboard />} />
                    
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
                    
                    {/* Team Routes */}
                    <Route path="teams/create" element={<TeamFormation />} />
                    <Route path="teams/:teamId/chat" element={<TeamChat />} />
                    
                    {/* Hackathon Routes */}
                    <Route path="hackathons" element={<HackathonList />} />
                    <Route path="hackathons/:hackathonId/submit" element={<HackathonSubmission />} />
                    
                    {/* Profile Routes */}
                    <Route path="profile" element={<StudentProfile />} />
                    
                    {/* Notifications Route */}
                    <Route path="notifications" element={<NotificationsPage />} />
                    
                    {/* Diary Management */}
                    <Route path="diary" element={<ProjectDiary />} />
                    <Route path="diary/:projectId" element={<ProjectDiary />} />
                    <Route path="progress/:projectId" element={<ProjectProgress />} />
                    
                    {/* Advanced Features */}
                    <Route path="achievements" element={<AchievementSystem />} />
                    <Route path="features" element={<FeatureAccessGuide />} />
                  </Route>
                </Route>

                {/* Catch all - redirect to landing */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
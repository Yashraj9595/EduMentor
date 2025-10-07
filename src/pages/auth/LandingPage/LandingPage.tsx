import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  User, 
  Building, 
  Trophy, 
  BookOpen, 
  CheckCircle, 
  ArrowRight,
  Users,
  FileText,
  BarChart3
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: GraduationCap,
      title: 'Student Projects',
      description: 'Create, manage, and showcase academic projects with mentor guidance',
    },
    {
      icon: User,
      title: 'Mentor Support',
      description: 'Connect with experienced mentors for project guidance and feedback',
    },
    {
      icon: Trophy,
      title: 'Hackathons',
      description: 'Participate in innovation challenges and team-based competitions',
    },
    {
      icon: Building,
      title: 'Industry Connection',
      description: 'Bridge the gap between academia and industry opportunities',
    },
  ];

  const benefits = [
    'Role-based access for Students, Mentors, Admins, Organizers, and Companies',
    'Project management with milestone tracking and deliverables',
    'Hackathon organization with team formation and live judging',
    'Mentor-student collaboration tools',
    'Portfolio building and skill showcasing',
    'Institution-wide analytics and reporting',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 w-full max-w-full">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 w-full">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">EduMentor</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/select-role"
                className="text-muted-foreground hover:text-primary font-medium transition-colors hidden sm:block"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-all shadow-sm hover:shadow-md"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Academic Project Management Platform
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Welcome to EduMentor
            <br />
            <span className="text-primary">Your Academic Success Platform</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Manage projects, connect with mentors, participate in hackathons, and showcase your skills - all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold text-lg transition-all shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/select-role"
              className="inline-flex items-center gap-2 px-8 py-4 bg-card text-card-foreground rounded-lg hover:bg-accent font-semibold text-lg transition-all border-2 border-border w-full sm:w-auto justify-center"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Academic Journey Awaits
            </h2>
            <p className="text-lg text-muted-foreground">
              Access your personalized workspace with role-specific features
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
              <div>
                <h2 className="text-3xl font-bold text-card-foreground mb-4">
                  Why Choose EduMentor?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Built specifically for academic project management with modern technologies and best practices.
                </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
          >
            Sign in now
            <ArrowRight className="w-4 h-4" />
          </Link>
              </div>
              <div>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-card-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 md:p-12 text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Academic Journey?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Join thousands of students, mentors, and institutions using EduMentor
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-background text-primary rounded-lg hover:bg-background/90 font-semibold text-lg transition-all shadow-lg w-full sm:w-auto justify-center"
          >
            Sign In Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted text-muted-foreground py-12 w-full">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">EduMentor Platform</span>
            </div>
            <p className="text-sm">© 2025 EduMentor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
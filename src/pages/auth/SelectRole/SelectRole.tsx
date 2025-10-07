import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  User, 
  Crown, 
  ArrowRight, 
  ArrowLeft, 
  Building,
  Trophy,
  } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { UserRole } from '../../../types/auth.types';

export const SelectRole: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const roles = [
    {
      value: 'student' as UserRole,
      title: 'Student',
      icon: GraduationCap,
      description: 'Perfect for students working on academic projects and seeking mentorship',
      features: [
        'Create & Manage Projects',
        'Find Mentors',
        'Team Collaboration',
        'Portfolio Building',
        'Hackathon Participation',
      ],
      color: 'bg-primary',
      borderColor: 'border-primary',
      bgColor: 'bg-primary/10',
      popular: false,
    },
    {
      value: 'mentor' as UserRole,
      title: 'Mentor',
      icon: User,
      description: 'Ideal for teachers and professionals guiding student projects',
      features: [
        'Mentor Project Requests',
        'Track Student Progress',
        'Provide Feedback',
        'Analytics Dashboard',
        'Post Problem Statements',
      ],
      color: 'bg-secondary',
      borderColor: 'border-secondary',
      bgColor: 'bg-secondary/10',
      popular: true,
    },
    {
      value: 'admin' as UserRole,
      title: 'College Admin',
      icon: Crown,
      description: 'Full access for administrators with complete institutional control',
      features: [
        'All User Management',
        'Institution-wide Monitoring',
        'System Settings',
        'Advanced Analytics',
        'Hackathon Management',
      ],
      color: 'bg-accent',
      borderColor: 'border-accent',
      bgColor: 'bg-accent/10',
      popular: false,
    },
    {
      value: 'organizer' as UserRole,
      title: 'Hackathon Organizer',
      icon: Trophy,
      description: 'For organizing hackathons and innovation challenges',
      features: [
        'Create Hackathons',
        'Manage Registrations',
        'Team Formation Tools',
        'Live Judging',
        'Event Management',
      ],
      color: 'bg-purple-500',
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-500/10',
      popular: false,
    },
    {
      value: 'company' as UserRole,
      title: 'Company',
      icon: Building,
      description: 'For companies posting challenges and recruiting talent',
      features: [
        'Post Challenges',
        'View Student Projects',
        'Talent Analytics',
        'Internship Opportunities',
        'Event Sponsorship',
      ],
      color: 'bg-green-500',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-500/10',
      popular: false,
    },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      navigate('/register', { state: { role: selectedRole } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 w-full">
      <div className="w-full max-w-6xl">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        <Card className="overflow-hidden">
          <CardBody className="p-8 md:p-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Choose Your Role
              </h1>
              <p className="text-lg text-muted-foreground">
                Select the role that best fits your needs in the EduMentor platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.value;
                
                return (
                  <button
                    key={role.value}
                    onClick={() => setSelectedRole(role.value)}
                    className={`
                      relative text-left p-6 rounded-xl border-2 transition-all
                      ${isSelected 
                        ? `${role.borderColor} ${role.bgColor} shadow-lg scale-105` 
                        : 'border-border hover:border-foreground/20 hover:shadow-md'
                      }
                    `}
                  >
                    {role.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          POPULAR
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`${role.color} p-3 rounded-lg`}>
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {role.title}
                      </h3>
                    </div>

                    <p className="text-muted-foreground mb-6 min-h-[48px]">
                      {role.description}
                    </p>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-foreground mb-2">
                        What you get:
                      </p>
                      {role.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${role.color}`} />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-primary">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
                  Sign in here
                </Link>
              </p>
              
              <Button
                onClick={handleContinue}
                disabled={!selectedRole}
                size="lg"
                className="min-w-[200px] w-full sm:w-auto"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
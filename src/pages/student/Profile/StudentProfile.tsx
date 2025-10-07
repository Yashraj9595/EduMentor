import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Link as LinkIcon, 
  Edit3, 
  Plus,
  Award,
  FileText,
  Github,
  Linkedin,
  Camera,
  Trophy
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock data - in a real app, this would come from the backend
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    branch: 'Computer Science',
    college: 'University of Technology',
    bio: 'Passionate about technology and innovation. Currently working on AI-driven solutions for social impact.',
    github: 'https://github.com/username',
    linkedin: 'https://linkedin.com/in/username',
    portfolio: 'https://portfolio.example.com'
  });

  const [skills] = useState<Skill[]>([
    { id: '1', name: 'JavaScript', level: 'advanced' },
    { id: '2', name: 'React', level: 'intermediate' },
    { id: '3', name: 'Node.js', level: 'intermediate' },
    { id: '4', name: 'Python', level: 'advanced' },
    { id: '5', name: 'Machine Learning', level: 'beginner' },
    { id: '6', name: 'UI/UX Design', level: 'intermediate' }
  ]);

  const [certifications] = useState<Certification[]>([
    { 
      id: '1', 
      title: 'AWS Certified Developer', 
      issuer: 'Amazon Web Services', 
      date: '2025-03-15',
      url: 'https://example.com/cert1'
    },
    { 
      id: '2', 
      title: 'Google Analytics Certification', 
      issuer: 'Google', 
      date: '2025-01-20',
      url: 'https://example.com/cert2'
    }
  ]);

  const [projects] = useState<Project[]>([
    { 
      id: '1', 
      title: 'AI-Powered Chatbot', 
      description: 'A conversational AI chatbot for customer support', 
      technologies: ['Python', 'TensorFlow', 'React'] 
    },
    { 
      id: '2', 
      title: 'E-Learning Platform', 
      description: 'A comprehensive online learning management system', 
      technologies: ['React', 'Node.js', 'MongoDB'] 
    }
  ]);

  const [achievements] = useState<Achievement[]>([
    { 
      id: '1', 
      title: '1st Place - Tech Innovation Challenge', 
      description: 'Won first place in the university hackathon', 
      date: '2025-05-10'
    },
    { 
      id: '2', 
      title: 'Dean\'s List', 
      description: 'Recognized for academic excellence', 
      date: '2025-04-01'
    }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-red-100 text-red-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-blue-100 text-blue-800';
      case 'expert': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardBody className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-center font-bold text-lg"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-center text-lg"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold">{profileData.firstName} {profileData.lastName}</h2>
                  <p className="text-muted-foreground">{profileData.branch}</p>
                  <p className="text-muted-foreground text-sm">{profileData.college}</p>
                </>
              )}
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <span>{profileData.email}</span>
                  )}
                </div>
                
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <span>{profileData.phone}</span>
                  )}
                </div>
                
                <div className="flex items-center justify-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="college"
                      value={profileData.college}
                      onChange={handleInputChange}
                      className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <span>{profileData.college}</span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center gap-3 mt-4">
                <a 
                  href={profileData.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href={profileData.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href={profileData.portfolio} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
                >
                  <LinkIcon className="w-5 h-5" />
                </a>
              </div>
            </CardBody>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Award className="w-5 h-5" />
                Skills
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getSkillLevelColor(skill.level)}`}>
                        {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          skill.level === 'beginner' ? 'w-1/4 bg-red-500' :
                          skill.level === 'intermediate' ? 'w-2/4 bg-yellow-500' :
                          skill.level === 'advanced' ? 'w-3/4 bg-blue-500' :
                          'w-full bg-green-500'
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm">
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </CardBody>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">About Me</h2>
            </CardHeader>
            <CardBody>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-gray-700">{profileData.bio}</p>
              )}
            </CardBody>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Award className="w-5 h-5" />
                Certifications
              </h2>
            </CardHeader>
            <CardBody>
              {certifications.length > 0 ? (
                <div className="space-y-4">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                      <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-medium">{cert.title}</h3>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(cert.date).toLocaleDateString()}</p>
                      </div>
                      {cert.url && (
                        <a 
                          href={cert.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No certifications added yet</p>
              )}
              
              <button className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm">
                <Plus className="w-4 h-4" />
                Add Certification
              </button>
            </CardBody>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Projects
              </h2>
            </CardHeader>
            <CardBody>
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No projects added yet</p>
              )}
              
              <button className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm">
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </CardBody>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Achievements
              </h2>
            </CardHeader>
            <CardBody>
              {achievements.length > 0 ? (
                <div className="space-y-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                      <Trophy className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-medium">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(achievement.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No achievements added yet</p>
              )}
              
              <button className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm">
                <Plus className="w-4 h-4" />
                Add Achievement
              </button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
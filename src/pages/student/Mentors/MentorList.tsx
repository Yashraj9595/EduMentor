import React, { useState } from 'react';
import { 
  User, 
  Search, 
  Filter, 
  Star, 
  Mail, 
  CheckCircle,
  Clock,
  MessageCircle
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Mentor {
  id: string;
  name: string;
  email: string;
  department: string;
  expertise: string[];
  rating: number;
  projectsMentored: number;
  availability: 'available' | 'full' | 'limited';
  bio: string;
}

export const MentorList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mentors] = useState<Mentor[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 's.johnson@university.edu',
      department: 'Computer Science',
      expertise: ['AI', 'Machine Learning', 'Data Science'],
      rating: 4.8,
      projectsMentored: 24,
      availability: 'available',
      bio: 'Specialized in artificial intelligence and machine learning with 10+ years of industry experience.'
    },
    {
      id: '2',
      name: 'Prof. Michael Chen',
      email: 'm.chen@university.edu',
      department: 'Electrical Engineering',
      expertise: ['IoT', 'Embedded Systems', 'Robotics'],
      rating: 4.6,
      projectsMentored: 18,
      availability: 'limited',
      bio: 'Expert in Internet of Things and embedded systems with multiple patents in smart devices.'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      email: 'e.rodriguez@university.edu',
      department: 'Information Technology',
      expertise: ['Web Development', 'Cloud Computing', 'Cybersecurity'],
      rating: 4.9,
      projectsMentored: 32,
      availability: 'full',
      bio: 'Cloud computing specialist with experience in enterprise solutions and cybersecurity.'
    },
    {
      id: '4',
      name: 'Prof. David Wilson',
      email: 'd.wilson@university.edu',
      department: 'Software Engineering',
      expertise: ['Mobile Apps', 'UI/UX', 'Agile Development'],
      rating: 4.7,
      projectsMentored: 27,
      availability: 'available',
      bio: 'Mobile application development expert with a focus on user experience and agile methodologies.'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterExpertise, setFilterExpertise] = useState('all');

  // Get unique departments and expertise areas
  const departments = Array.from(new Set(mentors.map(m => m.department)));
  const expertiseAreas = Array.from(new Set(mentors.flatMap(m => m.expertise)));

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          mentor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = filterDepartment === 'all' || mentor.department === filterDepartment;
    const matchesExpertise = filterExpertise === 'all' || mentor.expertise.includes(filterExpertise);
    
    return matchesSearch && matchesDepartment && matchesExpertise;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'full': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Find a Mentor</h1>
        <p className="text-muted-foreground">Browse and connect with mentors for your projects</p>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search mentors, departments, expertise..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <div>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterExpertise}
            onChange={(e) => setFilterExpertise(e.target.value)}
          >
            <option value="all">All Expertise</option>
            {expertiseAreas.map(exp => (
              <option key={exp} value={exp}>{exp}</option>
            ))}
          </select>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-medium text-primary">AI Mentor Recommendation</h3>
            <p className="text-sm text-primary/80">
              Based on your skills and project interests, we recommend Dr. Sarah Johnson for your AI project.
            </p>
          </div>
          <button className="ml-auto px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90">
            View Recommendation
          </button>
        </div>
      </div>

      {/* Mentors Grid */}
      {filteredMentors.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No mentors found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{mentor.name}</h3>
                    <p className="text-sm text-muted-foreground">{mentor.department}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(mentor.availability)}`}>
                    {mentor.availability.charAt(0).toUpperCase() + mentor.availability.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-600 mb-4">{mentor.bio}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {mentor.expertise.map((exp, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-foreground"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{mentor.rating}</span>
                    <span className="text-muted-foreground">({mentor.projectsMentored} projects)</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm">
                    <Mail className="w-4 h-4" />
                    Request
                  </button>
                  <button 
                    onClick={() => navigate(`/app/student/mentors/${mentor.id}/chat`)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </button>
                  <button className="flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm">
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
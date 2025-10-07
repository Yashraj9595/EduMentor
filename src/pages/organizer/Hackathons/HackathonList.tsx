import React, { useState } from 'react';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Tag,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Hackathon {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  maxTeams: number;
  registeredTeams: number;
  tags: string[];
  prizePool: string;
  status: 'upcoming' | 'registration_open' | 'in_progress' | 'completed';
}

export const HackathonList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hackathons] = useState<Hackathon[]>([
    {
      id: '1',
      title: 'Tech Innovation Challenge 2025',
      description: 'A 48-hour hackathon focused on solving real-world problems using emerging technologies.',
      startDate: '2025-11-15T09:00:00Z',
      endDate: '2025-11-17T18:00:00Z',
      location: 'Main Campus, Building A',
      maxTeams: 50,
      registeredTeams: 32,
      tags: ['AI', 'IoT', 'Blockchain'],
      prizePool: '$10,000',
      status: 'registration_open'
    },
    {
      id: '2',
      title: 'Data Science Hackathon',
      description: 'Compete to build the best data-driven solutions for social impact.',
      startDate: '2025-12-01T09:00:00Z',
      endDate: '2025-12-03T18:00:00Z',
      location: 'Online',
      maxTeams: 100,
      registeredTeams: 78,
      tags: ['Data Science', 'Machine Learning', 'Python'],
      prizePool: '$15,000',
      status: 'registration_open'
    },
    {
      id: '3',
      title: 'Green Tech Solutions',
      description: 'Create innovative solutions for environmental challenges.',
      startDate: '2025-10-20T09:00:00Z',
      endDate: '2025-10-22T18:00:00Z',
      location: 'Engineering Block, Room 201',
      maxTeams: 30,
      registeredTeams: 30,
      tags: ['Sustainability', 'IoT', 'Renewable Energy'],
      prizePool: '$8,000',
      status: 'in_progress'
    },
    {
      id: '4',
      title: 'Mobile App Development Contest',
      description: 'Build the next big mobile application for education.',
      startDate: '2025-11-05T09:00:00Z',
      endDate: '2025-11-07T18:00:00Z',
      location: 'Computer Science Department',
      maxTeams: 40,
      registeredTeams: 15,
      tags: ['Mobile', 'Android', 'iOS', 'UI/UX'],
      prizePool: '$5,000',
      status: 'upcoming'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredHackathons = hackathons.filter(hackathon => {
    const matchesSearch = hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          hackathon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hackathon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || hackathon.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'registration_open': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'registration_open': return 'Registration Open';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Hackathons & Events</h1>
        <p className="text-muted-foreground">Browse and register for upcoming hackathons</p>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search hackathons, tags, descriptions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="registration_open">Registration Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Hackathons Grid */}
      {filteredHackathons.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No hackathons found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredHackathons.map((hackathon) => (
            <Card key={hackathon.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">{hackathon.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(hackathon.status)}`}>
                    {getStatusText(hackathon.status)}
                  </span>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600 mb-4">{hackathon.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {hackathon.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{hackathon.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{hackathon.registeredTeams}/{hackathon.maxTeams} teams</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="w-4 h-4 text-muted-foreground" />
                    <span>{hackathon.prizePool} prize pool</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {hackathon.status === 'in_progress' ? (
                    <button 
                      onClick={() => navigate(`/app/student/hackathons/${hackathon.id}/submit`)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Submit Project
                    </button>
                  ) : (
                    <button 
                      className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                        hackathon.status === 'registration_open' 
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                      disabled={hackathon.status !== 'registration_open'}
                    >
                      {hackathon.status === 'registration_open' ? 'Register Now' : 'Registration Closed'}
                    </button>
                  )}
                  <button className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
                    View Details
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
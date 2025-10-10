import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  UserPlus, 
  UserMinus, 
  Calendar,
  Award,
  Trophy,
  CheckCircle,
  Clock,
  Eye,
} from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/SelectNew';

interface Team {
  id: string;
  name: string;
  leader: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  members: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  }[];
  hackathonId: string;
  registeredAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'active';
  projectName?: string;
  submissionStatus: 'not_started' | 'in_progress' | 'submitted' | 'under_review';
  skills: string[];
  experience: 'beginner' | 'intermediate' | 'advanced';
}

// interface Participant {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   university: string;
//   major: string;
//   year: string;
//   skills: string[];
//   experience: 'beginner' | 'intermediate' | 'advanced';
//   hackathonsParticipated: number;
//   lookingForTeam: boolean;
//   preferredRole: string;
//   bio: string;
//   portfolio: string;
//   linkedin: string;
//   github: string;
// }

export const TeamManagement: React.FC = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  // const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  // const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    fetchTeams();
    fetchParticipants();
  }, []);

  const fetchTeams = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockTeams: Team[] = [
        {
          id: '1',
          name: 'Tech Innovators',
          leader: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890'
          },
          members: [
            {
              id: '2',
              name: 'Jane Smith',
              email: 'jane@example.com',
              phone: '+1234567891',
              role: 'Developer'
            },
            {
              id: '3',
              name: 'Mike Johnson',
              email: 'mike@example.com',
              phone: '+1234567892',
              role: 'Designer'
            }
          ],
          hackathonId: 'hack-1',
          registeredAt: '2025-01-15T10:00:00Z',
          status: 'approved',
          projectName: 'AI Healthcare Assistant',
          submissionStatus: 'submitted',
          skills: ['React', 'Node.js', 'AI/ML'],
          experience: 'advanced'
        },
        {
          id: '2',
          name: 'Data Wizards',
          leader: {
            id: '4',
            name: 'Sarah Wilson',
            email: 'sarah@example.com',
            phone: '+1234567893'
          },
          members: [
            {
              id: '5',
              name: 'David Brown',
              email: 'david@example.com',
              phone: '+1234567894',
              role: 'Data Scientist'
            }
          ],
          hackathonId: 'hack-1',
          registeredAt: '2025-01-16T14:30:00Z',
          status: 'pending',
          submissionStatus: 'in_progress',
          skills: ['Python', 'Machine Learning', 'Data Analysis'],
          experience: 'intermediate'
        }
      ];
      setTeams(mockTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      // Mock data - in real app, fetch from API
      // const mockParticipants: Participant[] = [
      //   {
      //     id: '1',
      //     name: 'Alex Chen',
      //     email: 'alex@example.com',
      //     phone: '+1234567895',
      //     university: 'Tech University',
      //     major: 'Computer Science',
      //     year: 'Senior',
      //     skills: ['JavaScript', 'React', 'Node.js'],
      //     experience: 'intermediate',
      //     hackathonsParticipated: 3,
      //     lookingForTeam: true,
      //     preferredRole: 'Frontend Developer',
      //     bio: 'Passionate about web development and user experience',
      //     portfolio: 'https://alexchen.dev',
      //     linkedin: 'https://linkedin.com/in/alexchen',
      //     github: 'https://github.com/alexchen'
      //   }
      // ];
      // setParticipants(mockParticipants);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const handleTeamStatusChange = (teamId: string, status: Team['status']) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId ? { ...team, status } : team
    ));
  };

  const handleBulkStatusChange = (status: Team['status']) => {
    setTeams(prev => prev.map(team => 
      selectedTeams.includes(team.id) ? { ...team, status } : team
    ));
    setSelectedTeams([]);
    // setShowBulkActions(false);
  };

  const handleTeamSelection = (teamId: string) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.members.some(member => member.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || team.status === statusFilter;
    const matchesExperience = experienceFilter === 'all' || team.experience === experienceFilter;
    
    return matchesSearch && matchesStatus && matchesExperience;
  });

  const getStatusColor = (status: Team['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubmissionStatusColor = (status: Team['submissionStatus']) => {
    switch (status) {
      case 'not_started': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Team Management</h1>
            <p className="text-muted-foreground">Manage hackathon teams and participants</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/app/hackathon-dashboard')}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/app/organizer/hackathons')}
            >
              Hackathons
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/app/organizer/hackathons/create')}
            >
              Create Hackathon
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/app/organizer/hackathons/judging')}
            >
              Judging System
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/app/organizer/hackathons/analytics')}
            >
              Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search teams, members, or projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="active">Active</SelectItem>
          </SelectContent>
        </Select>

        <Select value={experienceFilter} onValueChange={setExperienceFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Experience</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedTeams.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-medium">{selectedTeams.length} teams selected</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleBulkStatusChange('approved')}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve Selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkStatusChange('rejected')}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Reject Selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedTeams([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Teams List */}
      <div className="space-y-4">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-shadow">
            <CardBody className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedTeams.includes(team.id)}
                    onChange={() => handleTeamSelection(team.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{team.name}</h3>
                      <Badge className={getStatusColor(team.status)}>
                        {team.status}
                      </Badge>
                      <Badge className={getSubmissionStatusColor(team.submissionStatus)}>
                        {team.submissionStatus.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Team Leader</h4>
                        <p className="font-medium">{team.leader.name}</p>
                        <p className="text-sm text-muted-foreground">{team.leader.email}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Project</h4>
                        <p className="font-medium">{team.projectName || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Team Members ({team.members.length + 1})</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <UserPlus className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{team.leader.name} (Leader)</span>
                        </div>
                        {team.members.map((member) => (
                          <div key={member.id} className="flex items-center gap-2 ml-6">
                            <UserMinus className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{member.name} ({member.role})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {team.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Registered: {new Date(team.registeredAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        <span className="capitalize">{team.experience} level</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {/* View team details */}}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Select
                    value={team.status}
                    onValueChange={(value) => handleTeamStatusChange(team.id, value as Team['status'])}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approve</SelectItem>
                      <SelectItem value="rejected">Reject</SelectItem>
                      <SelectItem value="active">Activate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Teams</p>
                <p className="text-2xl font-bold">{teams.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved Teams</p>
                <p className="text-2xl font-bold">{teams.filter(t => t.status === 'approved').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{teams.filter(t => t.status === 'pending').length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Submissions</p>
                <p className="text-2xl font-bold">{teams.filter(t => t.submissionStatus === 'submitted').length}</p>
              </div>
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

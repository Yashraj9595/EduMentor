import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Clock,
  Search,
  Award,
  Target,
  Eye,
  UserPlus
} from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Select } from '../../../components/ui/SelectNew';
import { apiService } from '../../../services/api';
import { useToast } from '../../../contexts/ToastContext';

interface Hackathon {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  startDate: string;
  endDate: string;
  location: string;
  locationType: 'physical' | 'virtual' | 'hybrid';
  maxTeams: number;
  maxTeamSize: number;
  minTeamSize: number;
  prizePool: string;
  currency: string;
  tags: string[];
  categories: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  participants: number;
  teams: number;
  organizerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface HackathonFilters {
  search: string;
  category: string;
  difficulty: string;
  status: string;
  locationType: string;
}

export const HackathonList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<HackathonFilters>({
    search: '',
    category: '',
    difficulty: '',
    status: '',
    locationType: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHackathons, setTotalHackathons] = useState(0);

  // Fetch hackathons
  const fetchHackathons = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllHackathons({
        page: currentPage,
        limit: 12,
        search: filters.search || undefined,
        status: filters.status || 'published',
        sortBy: 'startDate',
        sortOrder: 'asc'
      });

      if (response.success && response.data) {
        setHackathons(response.data.hackathons);
        setTotalPages(response.data.pagination.pages);
        setTotalHackathons(response.data.pagination.total);
      }
    } catch (error: any) {
      console.error('Error fetching hackathons:', error);
      showToast({ type: 'error', title: 'Failed to load hackathons' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, [currentPage, filters]);

  const handleFilterChange = (key: keyof HackathonFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchHackathons();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'mixed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getLocationTypeIcon = (locationType: string) => {
    switch (locationType) {
      case 'physical':
        return <MapPin className="h-4 w-4" />;
      case 'virtual':
        return <Users className="h-4 w-4" />;
      case 'hybrid':
        return <Target className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeUntilStart = (startDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const diffTime = start.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Started';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hackathons</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover and participate in exciting hackathon events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {totalHackathons} Hackathons
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search hackathons..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <option value="">All Categories</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="ai-ml">AI/ML</option>
                <option value="blockchain">Blockchain</option>
                <option value="iot">IoT</option>
                <option value="gaming">Gaming</option>
                <option value="fintech">FinTech</option>
                <option value="healthtech">HealthTech</option>
              </Select>

              <Select value={filters.difficulty} onValueChange={(value) => handleFilterChange('difficulty', value)}>
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="mixed">Mixed</option>
              </Select>

              <Select value={filters.locationType} onValueChange={(value) => handleFilterChange('locationType', value)}>
                <option value="">All Types</option>
                <option value="physical">Physical</option>
                <option value="virtual">Virtual</option>
                <option value="hybrid">Hybrid</option>
              </Select>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Hackathons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons.map((hackathon) => (
          <Card key={hackathon._id} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardBody className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {hackathon.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {hackathon.shortDescription || hackathon.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(hackathon.status)}>
                      {hackathon.status}
                    </Badge>
                    <Badge className={getDifficultyColor(hackathon.difficulty)}>
                      {hackathon.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    {getLocationTypeIcon(hackathon.locationType)}
                    <span>{hackathon.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{hackathon.participants} participants • {hackathon.teams} teams</span>
                  </div>

                  {hackathon.prizePool && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Award className="h-4 w-4" />
                      <span>{hackathon.prizePool} {hackathon.currency}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {hackathon.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {hackathon.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {hackathon.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{hackathon.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Time until start */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">
                      {getTimeUntilStart(hackathon.startDate)} until start
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/app/hackathons/${hackathon._id}`)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {hackathon.status === 'published' && (
                    <Button
                      size="sm"
                      onClick={() => navigate(`/app/hackathons/${hackathon._id}/register`)}
                      className="flex-1"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Register
                    </Button>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {hackathons.length === 0 && !loading && (
        <Card>
          <CardBody className="p-12 text-center">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hackathons found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or check back later for new hackathons.
            </p>
          </CardBody>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

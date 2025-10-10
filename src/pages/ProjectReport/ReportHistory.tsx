import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  User,
  Search,
  MoreVertical
} from 'lucide-react';

interface ReportDraft {
  _id: string;
  title: string;
  template: string;
  format: string;
  citationStyle: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'completed' | 'submitted';
}

export const ReportHistory: React.FC = () => {
  const [drafts, setDrafts] = useState<ReportDraft[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      // Simulate API call
      const mockDrafts: ReportDraft[] = [
        {
          _id: '1',
          title: 'Data Privacy Regulations Analysis',
          template: 'legal',
          format: 'pdf',
          citationStyle: 'bluebook',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-20T14:45:00Z',
          status: 'draft'
        },
        {
          _id: '2',
          title: 'Comparative Legal Framework Study',
          template: 'legal',
          format: 'docx',
          citationStyle: 'oscola',
          createdAt: '2024-01-10T09:15:00Z',
          updatedAt: '2024-01-18T16:20:00Z',
          status: 'completed'
        },
        {
          _id: '3',
          title: 'International Data Protection Laws',
          template: 'academic',
          format: 'pdf',
          citationStyle: 'apa',
          createdAt: '2024-01-05T11:00:00Z',
          updatedAt: '2024-01-12T13:30:00Z',
          status: 'submitted'
        }
      ];
      
      setDrafts(mockDrafts);
    } catch (error) {
      console.error('Error fetching drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrafts = drafts.filter(draft => {
    const matchesSearch = draft.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || draft.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Edit className="h-4 w-4" />;
      case 'completed':
        return <FileText className="h-4 w-4" />;
      case 'submitted':
        return <Download className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEditDraft = (draftId: string) => {
    // Navigate to report generator with draft
    window.location.href = `/project-report?draft=${draftId}`;
  };

  const handleDeleteDraft = async (draftId: string) => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      try {
        // API call to delete draft
        setDrafts(prev => prev.filter(draft => draft._id !== draftId));
      } catch (error) {
        console.error('Error deleting draft:', error);
      }
    }
  };

  const handleDownloadDraft = (draftId: string) => {
    // API call to download draft
    console.log('Downloading draft:', draftId);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Report History
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your saved report drafts and completed reports
          </p>
        </div>
        <Button onClick={() => window.location.href = '/project-report'}>
          <FileText className="h-4 w-4 mr-2" />
          Create New Report
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
            <option value="submitted">Submitted</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      {filteredDrafts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reports found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'You haven\'t created any reports yet'
              }
            </p>
            <Button onClick={() => window.location.href = '/project-report'}>
              Create Your First Report
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrafts.map((draft) => (
            <Card key={draft._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{draft.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusColor(draft.status)}>
                        {getStatusIcon(draft.status)}
                        <span className="ml-1 capitalize">{draft.status}</span>
                      </Badge>
                      <Badge variant="outline">
                        {draft.template.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Created: {formatDate(draft.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Updated: {formatDate(draft.updatedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Format: {draft.format.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Citation: {draft.citationStyle.toUpperCase()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEditDraft(draft._id)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadDraft(draft._id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteDraft(draft._id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Export is now at the top of the file

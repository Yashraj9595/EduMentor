import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Save, 
  Paperclip, 
  X, 
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../contexts/ToastContext';
import { apiService } from '../../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

interface Project {
  _id: string;
  title: string;
  description: string;
}

// interface DiaryEntry {
//   _id: string;
//   projectId: string;
//   entryType: 'daily' | 'weekly' | 'milestone' | 'review';
//   title: string;
//   content: string;
//   attachments: string[];
//   status: 'draft' | 'submitted' | 'approved' | 'rejected';
// }

interface Attachment {
  id: string;
  filename: string;
  url: string;
  type: 'image' | 'document' | 'code' | 'video';
}

export const EditDiaryEntry: React.FC = () => {
  const { projectId, entryId } = useParams<{ projectId: string; entryId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  const [formData, setFormData] = useState({
    entryType: 'daily',
    title: '',
    content: '',
    status: 'draft'
  });

  useEffect(() => {
    if (projectId && entryId) {
      fetchProjectDetails();
      fetchDiaryEntry();
    }
  }, [projectId, entryId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await apiService.get<any>(`/projects/${projectId}`);
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
      showError('Error', 'Failed to fetch project details');
    }
  };

  const fetchDiaryEntry = async () => {
    try {
      if (!entryId) return;
      
      const response = await apiService.get<any>(`/diary/entries/single/${entryId}`);
      const entry = response.data;
      
      setFormData({
        entryType: entry.entryType,
        title: entry.title,
        content: entry.content,
        status: entry.status
      });
      
      // Convert attachments to the format we use in the component
      const formattedAttachments = entry.attachments.map((url: string, index: number) => ({
        id: `attachment-${index}`,
        filename: url.split('/').pop() || 'attachment',
        url,
        type: getFileType(url)
      }));
      setAttachments(formattedAttachments);
    } catch (error) {
      console.error('Error fetching diary entry:', error);
      showError('Error', 'Failed to fetch diary entry');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // In a real app, you would upload the file to a server
      // For now, we'll just add it to the attachments list
      const newAttachment: Attachment = {
        id: Date.now().toString(),
        filename: file.name,
        url: URL.createObjectURL(file),
        type: getFileType(file.name)
      };
      setAttachments(prev => [...prev, newAttachment]);
    }
  };

  const getFileType = (filename: string): Attachment['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (['mp4', 'avi', 'mov', 'wmv'].includes(ext)) return 'video';
    if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'py', 'java', 'cpp'].includes(ext)) return 'code';
    return 'document';
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!entryId) {
        throw new Error('Entry ID is missing');
      }

      await apiService.put(`/diary/entries/${entryId}`, {
        entryType: formData.entryType as any,
        title: formData.title,
        content: formData.content,
        attachments: attachments.map(att => att.url),
        status: formData.status as any
      });
      
      showSuccess('Diary Entry Updated', 'Your diary entry has been updated successfully!');
      navigate(`/app/student/diary/${projectId}`);
    } catch (error) {
      console.error('Error updating diary entry:', error);
      showError('Error', 'Failed to update diary entry');
    } finally {
      setLoading(false);
    }
  };

  const entryTypes = [
    { value: 'daily', label: 'Daily Entry' },
    { value: 'weekly', label: 'Weekly Summary' },
    { value: 'milestone', label: 'Milestone Update' },
    { value: 'review', label: 'Review Preparation' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Save as Draft' },
    { value: 'submitted', label: 'Submit for Review' }
  ];

  if (!project) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            onClick={() => navigate(`/app/student/diary/${projectId}`)}
            variant="ghost"
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Diary Entry</h1>
            <p className="text-muted-foreground">
              {project.title}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Diary Entry Details
              </h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="entryType" className="block text-sm font-medium text-gray-700 mb-1">
                    Entry Type
                  </label>
                  <select
                    id="entryType"
                    name="entryType"
                    value={formData.entryType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {entryTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter a descriptive title for your diary entry"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe your progress, challenges, achievements, and next steps..."
                />
              </div>
            </CardBody>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Paperclip className="w-5 h-5" />
                Attachments
              </h2>
            </CardHeader>
            <CardBody>
              <div className="mb-4">
                <input
                  type="file"
                  id="attachments"
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple
                />
                <label 
                  htmlFor="attachments" 
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors cursor-pointer w-fit"
                >
                  <Paperclip className="w-4 h-4" />
                  Add Attachment
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {attachments.map(attachment => (
                    <div key={attachment.id} className="border rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium truncate max-w-[120px]">{attachment.filename}</p>
                          <p className="text-xs text-muted-foreground capitalize">{attachment.type}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(attachment.id)}
                        className="p-1 text-muted-foreground hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(`/app/student/diary/${projectId}`)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
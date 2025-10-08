import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';

interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: 'document' | 'template' | 'video' | 'link' | 'code';
  tags: string[];
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  isPublic: boolean;
  downloads: number;
  views: number;
  likes: number;
  relatedSkills: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const ResourceLibraryDashboard: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [myResources, setMyResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'project-template',
    type: 'document',
    fileUrl: '',
    externalUrl: '',
    content: '',
    tags: '',
    isPublic: true,
    relatedSkills: '',
    difficultyLevel: 'intermediate' as 'beginner' | 'intermediate' | 'advanced'
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'project-template', label: 'Project Templates' },
    { value: 'tutorial', label: 'Tutorials' },
    { value: 'best-practices', label: 'Best Practices' },
    { value: 'case-study', label: 'Case Studies' },
    { value: 'tool', label: 'Tools' },
    { value: 'research-paper', label: 'Research Papers' },
    { value: 'other', label: 'Other' }
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'document', label: 'Document' },
    { value: 'template', label: 'Template' },
    { value: 'video', label: 'Video' },
    { value: 'link', label: 'Link' },
    { value: 'code', label: 'Code Sample' }
  ];

  useEffect(() => {
    fetchResources();
    fetchMyResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<ApiResponse<any>>('/api/v1/resources');
      
      if (response.data && response.data.success) {
        setResources(response.data.data.resources || response.data.data);
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyResources = async () => {
    try {
      const response = await apiService.get<ApiResponse<Resource[]>>('/api/v1/resources/my-resources');
      if (response.data && response.data.success) {
        setMyResources(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching my resources:', err);
    }
  };

  const handleUpload = async () => {
    try {
      const resourceData = {
        ...uploadForm,
        tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        relatedSkills: uploadForm.relatedSkills.split(',').map(skill => skill.trim()).filter(skill => skill)
      };

      const response = await apiService.post<ApiResponse<Resource>>('/api/v1/resources', resourceData);
      
      if (response.data && response.data.success) {
        alert('Resource uploaded successfully!');
        setShowUploadForm(false);
        resetUploadForm();
        fetchMyResources();
      }
    } catch (err) {
      console.error('Error uploading resource:', err);
      alert('Failed to upload resource');
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      title: '',
      description: '',
      category: 'project-template',
      type: 'document',
      fileUrl: '',
      externalUrl: '',
      content: '',
      tags: '',
      isPublic: true,
      relatedSkills: '',
      difficultyLevel: 'intermediate'
    });
  };

  const handleDelete = async (resourceId: string) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      const response = await apiService.delete<ApiResponse<any>>(`/api/v1/resources/${resourceId}`);
      
      if (response.data && response.data.success) {
        alert('Resource deleted successfully!');
        fetchMyResources();
      }
    } catch (err) {
      console.error('Error deleting resource:', err);
      alert('Failed to delete resource');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return '📄';
      case 'template':
        return '📋';
      case 'video':
        return '🎥';
      case 'link':
        return '🔗';
      case 'code':
        return '💻';
      default:
        return '📁';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'project-template':
        return 'bg-blue-100 text-blue-800';
      case 'tutorial':
        return 'bg-green-100 text-green-800';
      case 'best-practices':
        return 'bg-purple-100 text-purple-800';
      case 'case-study':
        return 'bg-yellow-100 text-yellow-800';
      case 'tool':
        return 'bg-red-100 text-red-800';
      case 'research-paper':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Resource Library</h1>
        <button
          onClick={() => setShowUploadForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Upload Resource
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {types.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={fetchResources}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* My Resources Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Resources</h2>
        {myResources.length === 0 ? (
          <p className="text-gray-500">You haven't uploaded any resources yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myResources.map((resource) => (
              <div key={resource._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{getTypeIcon(resource.type)}</span>
                      <h3 className="font-medium text-gray-900">{resource.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{resource.description}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(resource._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                    {resource.category.replace('-', ' ')}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {resource.type}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {resource.difficultyLevel}
                  </span>
                </div>
                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <span className="mr-4">📥 {resource.downloads}</span>
                  <span>👁 {resource.views}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Resources Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Resources</h2>
        {resources.length === 0 ? (
          <p className="text-gray-500">No resources found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{getTypeIcon(resource.type)}</span>
                  <h3 className="font-medium text-gray-900">{resource.title}</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{resource.description}</p>
                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <span>By {resource.author.firstName} {resource.author.lastName}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                    {resource.category.replace('-', ' ')}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {resource.type}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {resource.difficultyLevel}
                  </span>
                </div>
                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <span className="mr-4">📥 {resource.downloads}</span>
                  <span>👁 {resource.views}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Resource Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Upload Resource</h3>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.filter(c => c.value !== 'all').map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={uploadForm.type}
                      onChange={(e) => setUploadForm({...uploadForm, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {types.filter(t => t.value !== 'all').map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={uploadForm.difficultyLevel}
                      onChange={(e) => setUploadForm({...uploadForm, difficultyLevel: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={uploadForm.isPublic}
                      onChange={(e) => setUploadForm({...uploadForm, isPublic: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Make Public
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File URL (if applicable)
                  </label>
                  <input
                    type="text"
                    value={uploadForm.fileUrl}
                    onChange={(e) => setUploadForm({...uploadForm, fileUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    External URL (if applicable)
                  </label>
                  <input
                    type="text"
                    value={uploadForm.externalUrl}
                    onChange={(e) => setUploadForm({...uploadForm, externalUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content (for text-based resources)
                  </label>
                  <textarea
                    value={uploadForm.content}
                    onChange={(e) => setUploadForm({...uploadForm, content: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                    placeholder="e.g., javascript, react, nodejs"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Related Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={uploadForm.relatedSkills}
                    onChange={(e) => setUploadForm({...uploadForm, relatedSkills: e.target.value})}
                    placeholder="e.g., frontend, backend, database"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceLibraryDashboard;
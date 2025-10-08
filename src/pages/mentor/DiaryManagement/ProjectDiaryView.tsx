import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface DiaryEntry {
  _id: string;
  projectId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  studentId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

const ProjectDiaryView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
      fetchDiaryEntries();
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await apiService.get<ApiResponse<Project>>(`/projects/${projectId}`);
      if (response.data && response.data.success) {
        setProject(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching project details:', err);
      setError('Failed to load project details');
    }
  };

  const fetchDiaryEntries = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<ApiResponse<DiaryEntry[]>>(`/diary/project/${projectId}`);
      if (response.data && response.data.success) {
        setDiaryEntries(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching diary entries:', err);
      setError('Failed to load diary entries');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    try {
      const entryData = {
        projectId,
        title: newEntry.title,
        content: newEntry.content,
        tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await apiService.post<ApiResponse<DiaryEntry>>('/diary', entryData);
      if (response.data && response.data.success) {
        setDiaryEntries([response.data.data, ...diaryEntries]);
        setNewEntry({ title: '', content: '', tags: '' });
        setShowAddForm(false);
      }
    } catch (err) {
      console.error('Error adding diary entry:', err);
      alert('Failed to add diary entry');
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!window.confirm('Are you sure you want to delete this diary entry?')) {
      return;
    }

    try {
      const response = await apiService.delete<ApiResponse<any>>(`/diary/${entryId}`);
      if (response.data && response.data.success) {
        setDiaryEntries(diaryEntries.filter(entry => entry._id !== entryId));
      }
    } catch (err) {
      console.error('Error deleting diary entry:', err);
      alert('Failed to delete diary entry');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate('/app/mentor-diary')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Projects
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {project ? `${project.title} - Diary` : 'Project Diary'}
          </h1>
          {project && (
            <p className="text-gray-600">
              Student: {project.studentId.firstName} {project.studentId.lastName}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Diary Entry
        </button>
      </div>

      {/* Add Diary Entry Form */}
      {showAddForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Diary Entry</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newEntry.title}
                onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entry title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={newEntry.content}
                onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your diary entry here..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={newEntry.tags}
                onChange={(e) => setNewEntry({...newEntry, tags: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., meeting, progress, feedback"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEntry}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diary Entries List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Diary Entries</h2>
        </div>
        {diaryEntries.length === 0 ? (
          <div className="p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No diary entries</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new diary entry for this project.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {diaryEntries.map((entry) => (
              <li key={entry._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{entry.title}</h3>
                    <p className="mt-1 text-gray-600">{entry.content}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteEntry(entry._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(entry.createdAt).toLocaleDateString()} at {new Date(entry.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProjectDiaryView;
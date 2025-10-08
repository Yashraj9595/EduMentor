import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';

interface MentorPreference {
  preferredSkills: string[];
  preferredCategories: string[];
  maxStudents: number;
  availability: {
    days: string[];
    timeSlots: {
      day: string;
      startTime: string;
      endTime: string;
    }[];
  };
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  mentoringStyle: 'hands-on' | 'guidance' | 'mixed';
  languages: string[];
  isActive: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const MentorMatchingDashboard: React.FC = () => {
  const [preferences, setPreferences] = useState<MentorPreference>({
    preferredSkills: [],
    preferredCategories: [],
    maxStudents: 5,
    availability: {
      days: [],
      timeSlots: []
    },
    experienceLevel: 'intermediate',
    mentoringStyle: 'mixed',
    languages: [],
    isActive: true
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [matchRequests, setMatchRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchPreferences();
    fetchMatchRequests();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<ApiResponse<MentorPreference>>('/api/v1/mentor-matching/mentor/preferences');
      if (response.data && response.data.success && response.data.data) {
        setPreferences({
          ...preferences,
          ...response.data.data
        });
      }
    } catch (err) {
      console.error('Error fetching preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchRequests = async () => {
    try {
      const response = await apiService.get<ApiResponse<any[]>>('/api/v1/mentor-matching/matches/requests');
      if (response.data && response.data.success) {
        setMatchRequests(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching match requests:', err);
    }
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      const response = await apiService.post<ApiResponse<MentorPreference>>('/api/v1/mentor-matching/mentor/preferences', preferences);
      if (response.data && response.data.success) {
        alert('Preferences saved successfully!');
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      alert('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !preferences.preferredSkills.includes(newSkill.trim())) {
      setPreferences({
        ...preferences,
        preferredSkills: [...preferences.preferredSkills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setPreferences({
      ...preferences,
      preferredSkills: preferences.preferredSkills.filter(s => s !== skill)
    });
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !preferences.preferredCategories.includes(newCategory.trim())) {
      setPreferences({
        ...preferences,
        preferredCategories: [...preferences.preferredCategories, newCategory.trim()]
      });
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setPreferences({
      ...preferences,
      preferredCategories: preferences.preferredCategories.filter(c => c !== category)
    });
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !preferences.languages.includes(newLanguage.trim())) {
      setPreferences({
        ...preferences,
        languages: [...preferences.languages, newLanguage.trim()]
      });
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (language: string) => {
    setPreferences({
      ...preferences,
      languages: preferences.languages.filter(l => l !== language)
    });
  };

  const handleAcceptRequest = async (matchId: string) => {
    try {
      const response = await apiService.put<ApiResponse<any>>(`/api/v1/mentor-matching/matches/${matchId}/accept`, {});
      if (response.data && response.data.success) {
        alert('Match request accepted!');
        fetchMatchRequests(); // Refresh the list
      }
    } catch (err) {
      console.error('Error accepting match request:', err);
      alert('Failed to accept match request');
    }
  };

  const handleRejectRequest = async (matchId: string) => {
    try {
      const response = await apiService.put<ApiResponse<any>>(`/api/v1/mentor-matching/matches/${matchId}/reject`, {});
      if (response.data && response.data.success) {
        alert('Match request rejected!');
        fetchMatchRequests(); // Refresh the list
      }
    } catch (err) {
      console.error('Error rejecting match request:', err);
      alert('Failed to reject match request');
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
        <h1 className="text-2xl font-bold text-gray-900">Mentor Matching System</h1>
      </div>

      {/* Match Requests Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Match Requests</h2>
        {matchRequests.length === 0 ? (
          <p className="text-gray-500">No pending match requests.</p>
        ) : (
          <div className="space-y-4">
            {matchRequests.map((request) => (
              <div key={request._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {request.studentId?.firstName} {request.studentId?.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{request.studentId?.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Requested on {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAcceptRequest(request._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preferences Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Preferences</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Max Students */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Students
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={preferences.maxStudents}
              onChange={(e) => setPreferences({
                ...preferences,
                maxStudents: parseInt(e.target.value) || 5
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level
            </label>
            <select
              value={preferences.experienceLevel}
              onChange={(e) => setPreferences({
                ...preferences,
                experienceLevel: e.target.value as any
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Mentoring Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mentoring Style
            </label>
            <select
              value={preferences.mentoringStyle}
              onChange={(e) => setPreferences({
                ...preferences,
                mentoringStyle: e.target.value as any
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="hands-on">Hands-on</option>
              <option value="guidance">Guidance</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.isActive}
              onChange={(e) => setPreferences({
                ...preferences,
                isActive: e.target.checked
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Available for new students
            </label>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Skills
          </label>
          <div className="flex">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
            />
            <button
              onClick={handleAddSkill}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {preferences.preferredSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {skill}
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Categories
          </label>
          <div className="flex">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Add a category"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {preferences.preferredCategories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
              >
                {category}
                <button
                  onClick={() => handleRemoveCategory(category)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Languages
          </label>
          <div className="flex">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Add a language"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
            />
            <button
              onClick={handleAddLanguage}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {preferences.languages.map((language) => (
              <span
                key={language}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
              >
                {language}
                <button
                  onClick={() => handleRemoveLanguage(language)}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={savePreferences}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorMatchingDashboard;
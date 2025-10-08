import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';

interface Mentor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  skills: string[];
}

interface ConnectionRequest {
  _id: string;
  mentor1: Mentor;
  mentor2: Mentor;
  requestedBy: Mentor;
  status: string;
  createdAt: string;
}

interface Group {
  _id: string;
  name: string;
  description: string;
  createdBy: Mentor;
  members: Mentor[];
  isPublic: boolean;
  createdAt: string;
}

interface Discussion {
  _id: string;
  title: string;
  content: string;
  author: Mentor;
  groupId?: Group;
  tags: string[];
  likes: string[];
  replies: any[];
  views: number;
  isPinned: boolean;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const MentorNetworkingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('connections');
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [connectedMentors, setConnectedMentors] = useState<Mentor[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
  const [showCreateDiscussionForm, setShowCreateDiscussionForm] = useState(false);
  
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    isPublic: true
  });
  
  const [discussionForm, setDiscussionForm] = useState({
    title: '',
    content: '',
    groupId: '',
    tags: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchConnectionRequests(),
        fetchConnectedMentors(),
        fetchGroups(),
        fetchDiscussions()
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnectionRequests = async () => {
    try {
      const response = await apiService.get<ApiResponse<ConnectionRequest[]>>('/api/v1/mentor-networking/connections/requests');
      if (response.data && response.data.success) {
        setConnectionRequests(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching connection requests:', err);
    }
  };

  const fetchConnectedMentors = async () => {
    try {
      const response = await apiService.get<ApiResponse<Mentor[]>>('/api/v1/mentor-networking/connections');
      if (response.data && response.data.success) {
        setConnectedMentors(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching connected mentors:', err);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await apiService.get<ApiResponse<Group[]>>('/api/v1/mentor-networking/groups');
      if (response.data && response.data.success) {
        setGroups(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching groups:', err);
    }
  };

  const fetchDiscussions = async () => {
    try {
      const response = await apiService.get<ApiResponse<Discussion[]>>('/api/v1/mentor-networking/discussions');
      if (response.data && response.data.success) {
        setDiscussions(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching discussions:', err);
    }
  };

  const handleAcceptRequest = async (connectionId: string) => {
    try {
      const response = await apiService.put<ApiResponse<any>>(`/api/v1/mentor-networking/connections/${connectionId}/accept`, {});
      if (response.data && response.data.success) {
        alert('Connection request accepted!');
        fetchAllData();
      }
    } catch (err) {
      console.error('Error accepting connection request:', err);
      alert('Failed to accept connection request');
    }
  };

  const handleRejectRequest = async (connectionId: string) => {
    try {
      const response = await apiService.put<ApiResponse<any>>(`/api/v1/mentor-networking/connections/${connectionId}/reject`, {});
      if (response.data && response.data.success) {
        alert('Connection request rejected!');
        fetchAllData();
      }
    } catch (err) {
      console.error('Error rejecting connection request:', err);
      alert('Failed to reject connection request');
    }
  };

  const handleCreateGroup = async () => {
    try {
      const response = await apiService.post<ApiResponse<Group>>('/api/v1/mentor-networking/groups', groupForm);
      if (response.data && response.data.success) {
        alert('Group created successfully!');
        setShowCreateGroupForm(false);
        setGroupForm({ name: '', description: '', isPublic: true });
        fetchGroups();
      }
    } catch (err) {
      console.error('Error creating group:', err);
      alert('Failed to create group');
    }
  };

  const handleCreateDiscussion = async () => {
    try {
      const discussionData = {
        ...discussionForm,
        tags: discussionForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await apiService.post<ApiResponse<Discussion>>('/api/v1/mentor-networking/discussions', discussionData);
      if (response.data && response.data.success) {
        alert('Discussion created successfully!');
        setShowCreateDiscussionForm(false);
        setDiscussionForm({ title: '', content: '', groupId: '', tags: '' });
        fetchDiscussions();
      }
    } catch (err) {
      console.error('Error creating discussion:', err);
      alert('Failed to create discussion');
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      const response = await apiService.post<ApiResponse<any>>(`/api/v1/mentor-networking/groups/${groupId}/join`, {});
      if (response.data && response.data.success) {
        alert('Join request sent successfully!');
        fetchGroups();
      }
    } catch (err) {
      console.error('Error joining group:', err);
      alert('Failed to join group');
    }
  };

  const handleLikeDiscussion = async (discussionId: string) => {
    try {
      const response = await apiService.post<ApiResponse<any>>(`/api/v1/mentor-networking/discussions/${discussionId}/like`, {});
      if (response.data && response.data.success) {
        fetchDiscussions();
      }
    } catch (err) {
      console.error('Error liking discussion:', err);
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
        <h1 className="text-2xl font-bold text-gray-900">Mentor Networking</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('connections')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'connections'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Connections
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'groups'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Groups
          </button>
          <button
            onClick={() => setActiveTab('discussions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'discussions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Discussions
          </button>
        </nav>
      </div>

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <div className="space-y-6">
          {/* Connection Requests */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Connection Requests</h2>
            </div>
            {connectionRequests.length === 0 ? (
              <p className="text-gray-500">No pending connection requests.</p>
            ) : (
              <div className="space-y-4">
                {connectionRequests.map((request) => (
                  <div key={request._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {request.requestedBy.firstName} {request.requestedBy.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{request.requestedBy.email}</p>
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

          {/* Connected Mentors */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Connected Mentors</h2>
            </div>
            {connectedMentors.length === 0 ? (
              <p className="text-gray-500">You haven't connected with any mentors yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connectedMentors.map((mentor) => (
                  <div key={mentor._id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">
                      {mentor.firstName} {mentor.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{mentor.email}</p>
                    {mentor.bio && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{mentor.bio}</p>
                    )}
                    {mentor.skills && mentor.skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {mentor.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                        {mentor.skills.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{mentor.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Groups Tab */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowCreateGroupForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Group
            </button>
          </div>

          {groups.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-gray-500">No groups found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <div key={group._id} className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                    </div>
                    {!group.isPublic && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Private
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <span>{group.members.length} members</span>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => handleJoinGroup(group._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Join Group
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Discussions Tab */}
      {activeTab === 'discussions' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowCreateDiscussionForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Discussion
            </button>
          </div>

          {discussions.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-gray-500">No discussions found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {discussions.map((discussion) => (
                <div key={discussion._id} className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{discussion.title}</h3>
                    {discussion.isPinned && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Pinned
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-2">{discussion.content}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>By {discussion.author.firstName} {discussion.author.lastName}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                      {discussion.groupId && (
                        <>
                          <span className="mx-2">•</span>
                          <span>In {discussion.groupId.name}</span>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => handleLikeDiscussion(discussion._id)}
                      className={`flex items-center ${
                        discussion.likes.includes('current-user-id') 
                          ? 'text-red-600' 
                          : 'text-gray-500 hover:text-red-600'
                      }`}
                    >
                      ❤️ {discussion.likes.length}
                    </button>
                  </div>
                  {discussion.tags && discussion.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {discussion.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroupForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create Group</h3>
                <button
                  onClick={() => setShowCreateGroupForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={groupForm.name}
                    onChange={(e) => setGroupForm({...groupForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={groupForm.description}
                    onChange={(e) => setGroupForm({...groupForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={groupForm.isPublic}
                    onChange={(e) => setGroupForm({...groupForm, isPublic: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Make Public
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateGroupForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Discussion Modal */}
      {showCreateDiscussionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create Discussion</h3>
                <button
                  onClick={() => setShowCreateDiscussionForm(false)}
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
                    value={discussionForm.title}
                    onChange={(e) => setDiscussionForm({...discussionForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={discussionForm.content}
                    onChange={(e) => setDiscussionForm({...discussionForm, content: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group (Optional)
                  </label>
                  <select
                    value={discussionForm.groupId}
                    onChange={(e) => setDiscussionForm({...discussionForm, groupId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a group</option>
                    {groups.map((group) => (
                      <option key={group._id} value={group._id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={discussionForm.tags}
                    onChange={(e) => setDiscussionForm({...discussionForm, tags: e.target.value})}
                    placeholder="e.g., javascript, react, nodejs"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateDiscussionForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDiscussion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorNetworkingDashboard;
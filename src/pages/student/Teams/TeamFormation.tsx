import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Mail, 
  User, 
  CheckCircle,
  XCircle,
  Send
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'declined';
}

export const TeamFormation: React.FC = () => {
  const { user } = useAuth();
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: user?.firstName + ' ' + user?.lastName,
      email: user?.email || '',
      role: 'Team Leader',
      status: 'accepted'
    }
  ]);

  const handleAddMember = () => {
    if (newMemberEmail && !teamMembers.some(m => m.email === newMemberEmail)) {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: 'Pending Invitation',
        email: newMemberEmail,
        role: '',
        status: 'pending'
      };
      setTeamMembers([...teamMembers, newMember]);
      setNewMemberEmail('');
    }
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const handleRoleChange = (id: string, role: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, role } : member
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send invitations to team members
    alert('Team created and invitations sent!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Team</h1>
        <p className="text-muted-foreground">Form a team for your project or hackathon</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Information
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
                Team Name *
              </label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter team name"
              />
            </div>

            <div>
              <label htmlFor="teamDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Team Description
              </label>
              <textarea
                id="teamDescription"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe your team's purpose and goals"
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Team Members
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4 mb-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    {member.status !== 'accepted' && (
                      <p className="text-xs text-yellow-600 mt-1">
                        {member.status === 'pending' ? 'Invitation sent' : 'Invitation declined'}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {member.status === 'accepted' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : member.status === 'declined' ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <Send className="w-5 h-5 text-yellow-500" />
                    )}
                    
                    {member.id !== teamMembers[0].id && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-medium mb-3">Add Team Member</h3>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="Enter teammate's email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Create Team
          </button>
        </div>
      </form>
    </div>
  );
};
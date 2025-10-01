import React, { useState, useEffect } from 'react';
import { Users, Plus, Copy, Check, UserPlus, Trash2, RefreshCw, LogOut } from 'lucide-react';
import { teamAPI } from '../api/teams';
import type { Team } from '../types/team';
import { useAuth } from '../contexts/AuthContext';

export const TeamManagement: React.FC = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form states
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const data = await teamAPI.getMyTeams();
      setTeams(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const team = await teamAPI.createTeam({
        name: newTeamName,
        description: newTeamDescription,
      });
      setTeams([team, ...teams]);
      setNewTeamName('');
      setNewTeamDescription('');
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create team');
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const team = await teamAPI.joinTeam({ inviteCode: joinCode });
      setTeams([team, ...teams]);
      setJoinCode('');
      setShowJoinModal(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to join team');
    }
  };

  const handleCopyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRegenerateCode = async (teamId: string) => {
    try {
      const newCode = await teamAPI.regenerateInviteCode(teamId);
      setTeams(teams.map(t => t._id === teamId ? { ...t, inviteCode: newCode } : t));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to regenerate code');
    }
  };

  const handleLeaveTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to leave this team?')) return;
    
    try {
      await teamAPI.leaveTeam(teamId);
      setTeams(teams.filter(t => t._id !== teamId));
      setSelectedTeam(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to leave team');
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) return;
    
    try {
      await teamAPI.deleteTeam(teamId);
      setTeams(teams.filter(t => t._id !== teamId));
      setSelectedTeam(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete team');
    }
  };

  const handleRemoveMember = async (teamId: string, memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    try {
      const updatedTeam = await teamAPI.removeMember(teamId, memberId);
      setTeams(teams.map(t => t._id === teamId ? updatedTeam : t));
      if (selectedTeam?._id === teamId) {
        setSelectedTeam(updatedTeam);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to remove member');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Team Collaboration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create teams and work together in real-time
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-lg"
          >
            <UserPlus className="h-5 w-5" />
            Join Team
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Create Team
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl">
          {error}
        </div>
      )}

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No teams yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create a team or join one with an invite code
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => {
            const isOwner = team.owner._id === user?.id;
            return (
              <div
                key={team._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedTeam(team)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {team.name}
                    </h3>
                    {team.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {team.description}
                      </p>
                    )}
                  </div>
                  {isOwner && (
                    <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                      Owner
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <Users className="h-4 w-4" />
                  <span>{team.members.length} members</span>
                </div>

                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                  <code className="flex-1 text-sm font-mono text-gray-900 dark:text-white">
                    {team.inviteCode}
                  </code>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyInviteCode(team.inviteCode);
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    {copiedCode === team.inviteCode ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Create New Team
            </h2>
            <form onSubmit={handleCreateTeam}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                  maxLength={50}
                  placeholder="My Hackathon Team"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  maxLength={200}
                  placeholder="Working on awesome project..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewTeamName('');
                    setNewTeamDescription('');
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Team Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Join Team
            </h2>
            <form onSubmit={handleJoinTeam}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Invite Code
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white font-mono text-lg"
                  required
                  placeholder="ABC123"
                  maxLength={8}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowJoinModal(false);
                    setJoinCode('');
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all"
                >
                  Join Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Details Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedTeam.name}
                </h2>
                {selectedTeam.description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {selectedTeam.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedTeam(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* Invite Code Section */}
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Invite Code
                  </p>
                  <code className="text-xl font-mono font-bold text-gray-900 dark:text-white">
                    {selectedTeam.inviteCode}
                  </code>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyInviteCode(selectedTeam.inviteCode)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all"
                    title="Copy code"
                  >
                    {copiedCode === selectedTeam.inviteCode ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                  {selectedTeam.owner._id === user?.id && (
                    <button
                      onClick={() => handleRegenerateCode(selectedTeam._id)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all"
                      title="Regenerate code"
                    >
                      <RefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Members List */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Members ({selectedTeam.members.length})
              </h3>
              <div className="space-y-2">
                {selectedTeam.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {member.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {member._id === selectedTeam.owner._id && (
                        <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                          Owner
                        </span>
                      )}
                      {selectedTeam.owner._id === user?.id &&
                        member._id !== selectedTeam.owner._id && (
                          <button
                            onClick={() => handleRemoveMember(selectedTeam._id, member._id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
                            title="Remove member"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {selectedTeam.owner._id === user?.id ? (
                <button
                  onClick={() => handleDeleteTeam(selectedTeam._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all"
                >
                  <Trash2 className="h-5 w-5" />
                  Delete Team
                </button>
              ) : (
                <button
                  onClick={() => handleLeaveTeam(selectedTeam._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  Leave Team
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

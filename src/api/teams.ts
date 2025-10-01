import axios from 'axios';
import type { Team, CreateTeamData, JoinTeamData } from '../types/team';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://172.26.81.221:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/teams`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const teamAPI = {
  // Create a new team
  createTeam: async (data: CreateTeamData): Promise<Team> => {
    const response = await api.post('/', data);
    return response.data.data.team;
  },

  // Get all teams for current user
  getMyTeams: async (): Promise<Team[]> => {
    const response = await api.get('/');
    return response.data.data.teams;
  },

  // Get team by ID
  getTeamById: async (teamId: string): Promise<Team> => {
    const response = await api.get(`/${teamId}`);
    return response.data.data.team;
  },

  // Join team with invite code
  joinTeam: async (data: JoinTeamData): Promise<Team> => {
    const response = await api.post('/join', data);
    return response.data.data.team;
  },

  // Leave a team
  leaveTeam: async (teamId: string): Promise<void> => {
    await api.post(`/${teamId}/leave`);
  },

  // Remove member from team
  removeMember: async (teamId: string, memberId: string): Promise<Team> => {
    const response = await api.delete(`/${teamId}/members/${memberId}`);
    return response.data.data.team;
  },

  // Delete team
  deleteTeam: async (teamId: string): Promise<void> => {
    await api.delete(`/${teamId}`);
  },

  // Regenerate invite code
  regenerateInviteCode: async (teamId: string): Promise<string> => {
    const response = await api.post(`/${teamId}/regenerate-code`);
    return response.data.data.inviteCode;
  },
};

// Team types
export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
}

export interface Team {
  _id: string;
  name: string;
  description?: string;
  owner: TeamMember;
  members: TeamMember[];
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamData {
  name: string;
  description?: string;
}

export interface JoinTeamData {
  inviteCode: string;
}

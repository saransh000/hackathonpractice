export interface Task {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color?: string;
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
  teamMembers: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
}
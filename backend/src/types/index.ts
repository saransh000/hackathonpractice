export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: string;
  teamMember?: string;
  column?: string;
  boardId: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: string;
  teamMember?: string;
  column?: string;
  position?: number;
}

export interface CreateBoardRequest {
  title: string;
  description?: string;
  teamMembers?: string[];
  isPublic?: boolean;
}

export interface UpdateBoardRequest {
  title?: string;
  description?: string;
  columns?: Array<{
    id: string;
    title: string;
    color?: string;
    position: number;
  }>;
  teamMembers?: string[];
  isPublic?: boolean;
}

export interface TaskQuery {
  board?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  column?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface BoardQuery {
  page?: number;
  limit?: number;
  sort?: string;
  isPublic?: boolean;
}
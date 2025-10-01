import { http } from './http';

export type TaskDTO = {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: string;
  teamMember?: string;
  board: string;
  column: string;
  position: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskDTO = {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: string;
  teamMember?: string;
  column?: string;
  boardId: string;
};

export type UpdateTaskDTO = {
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: string;
  teamMember?: string;
  column?: string;
  position?: number;
};

type ApiList<T> = { success: boolean; count?: number; data: T[]; pagination?: any };
type ApiOne<T> = { success: boolean; data: T };

// Get user token from localStorage (AuthContext stores token under 'token')
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Add auth header to requests
const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getTasks(boardId?: string) {
  const queryParams = boardId ? `?board=${boardId}` : '';
  const res = await http<ApiList<TaskDTO>>(`/api/tasks${queryParams}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function getTask(id: string) {
  const res = await http<ApiOne<TaskDTO>>(`/api/tasks/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function createTask(payload: CreateTaskDTO) {
  const res = await http<ApiOne<TaskDTO>>('/api/tasks', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function updateTask(id: string, payload: UpdateTaskDTO) {
  const res = await http<ApiOne<TaskDTO>>(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deleteTask(id: string) {
  const res = await http<ApiOne<{}>>(`/api/tasks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.data;
}

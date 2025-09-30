import { http } from './http';

export type TaskDTO = {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: string;
  teamMember?: string;
  createdAt: string;
  updatedAt: string;
};

type ApiList<T> = { success: boolean; count?: number; data: T[] };

type ApiOne<T> = { success: boolean; data: T };

export async function getTasks() {
  const res = await http<ApiList<TaskDTO>>('/api/tasks');
  return res.data;
}

export async function createTask(payload: Partial<TaskDTO>) {
  const res = await http<ApiOne<TaskDTO>>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function updateTask(id: string, payload: Partial<TaskDTO>) {
  const res = await http<ApiOne<TaskDTO>>(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deleteTask(id: string) {
  const res = await http<{ success: boolean }>(`/api/tasks/${id}`, { method: 'DELETE' });
  return res.success;
}

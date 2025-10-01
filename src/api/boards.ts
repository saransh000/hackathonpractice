import { http } from './http';

export type BoardDTO = {
  _id: string;
  title: string;
  description?: string;
  columns: Array<{
    id: string;
    title: string;
    color?: string;
    position: number;
  }>;
  teamMembers: Array<{
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  tasks?: Record<string, any[]>; // Tasks organized by column
};

export type CreateBoardDTO = {
  title: string;
  description?: string;
  teamMembers?: string[];
  isPublic?: boolean;
};

export type UpdateBoardDTO = {
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

export async function getBoards() {
  const res = await http<ApiList<BoardDTO>>('/api/boards', {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function getBoard(id: string) {
  const res = await http<ApiOne<BoardDTO>>(`/api/boards/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function createBoard(payload: CreateBoardDTO) {
  const res = await http<ApiOne<BoardDTO>>('/api/boards', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function updateBoard(id: string, payload: UpdateBoardDTO) {
  const res = await http<ApiOne<BoardDTO>>(`/api/boards/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deleteBoard(id: string) {
  const res = await http<ApiOne<{}>>(`/api/boards/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function addBoardMember(boardId: string, userId: string) {
  const res = await http<ApiOne<BoardDTO>>(`/api/boards/${boardId}/members`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId }),
  });
  return res.data;
}

export async function removeBoardMember(boardId: string, userId: string) {
  const res = await http<ApiOne<BoardDTO>>(`/api/boards/${boardId}/members/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.data;
}
import { http } from './http';

export type UserDTO = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member';
  createdAt?: string;
  updatedAt?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: UserDTO;
};

type ApiOne<T> = { success: boolean; data: T };
type ApiList<T> = { success: boolean; count?: number; data: T[] };

// Get user token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Add auth header to requests
const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Set auth token in localStorage
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

// Remove auth token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export async function register(credentials: RegisterCredentials) {
  const res = await http<ApiOne<AuthResponse>>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  // Store token for future requests
  if (res.data.token) {
    setAuthToken(res.data.token);
  }
  
  return res.data;
}

export async function login(credentials: LoginCredentials) {
  const res = await http<ApiOne<AuthResponse>>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  // Store token for future requests
  if (res.data.token) {
    setAuthToken(res.data.token);
  }
  
  return res.data;
}

export async function getCurrentUser() {
  const res = await http<ApiOne<UserDTO>>('/api/auth/me', {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function logout() {
  removeAuthToken();
  // Could also call a logout endpoint if needed
  return Promise.resolve();
}

export async function getUsers(search?: string) {
  const queryParams = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await http<ApiList<UserDTO>>(`/api/users${queryParams}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function getUser(id: string) {
  const res = await http<ApiOne<UserDTO>>(`/api/users/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}
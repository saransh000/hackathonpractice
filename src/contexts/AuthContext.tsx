import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials, AuthContextType, SignupData } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const DEMO_USERS: User[] = [
  { id: '1', name: 'Alex Chen', email: 'alex@hackathon.com', role: 'admin' },
  { id: '2', name: 'Sarah Kim', email: 'sarah@hackathon.com', role: 'member' },
  { id: '3', name: 'Mike Johnson', email: 'mike@hackathon.com', role: 'member' },
  { id: '4', name: 'Emma Davis', email: 'emma@hackathon.com', role: 'member' },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Always start with no user - require login every time
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('registeredUsers');
    return saved ? JSON.parse(saved) : [...DEMO_USERS];
  });

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    
    try {
      // Make real API call to backend (use Vite env variable or fallback to localhost)
      const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      // Create user object from backend response
      const loggedInUser: User = {
        id: result.data.user.id,
        name: result.data.user.name,
        email: result.data.user.email,
        role: result.data.user.role,
      };

      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('token', result.data.token); // Store JWT token
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || 'Invalid credentials');
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    
    try {
      // Make real API call to backend
      const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      // Create user object from backend response
      const newUser: User = {
        id: result.data.user.id,
        name: result.data.user.name,
        email: result.data.user.email,
        role: result.data.user.role,
      };

      // Update registered users list
      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint
      const token = window.localStorage.getItem('token');
      if (token) {
        const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000';
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage and state
      setUser(null);
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      signup,
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
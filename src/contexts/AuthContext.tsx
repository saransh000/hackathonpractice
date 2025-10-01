 import React, { createContext, useContext, useState, useEffect } from 'react';
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
  // Initialize user from localStorage so reload keeps the session
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = window.localStorage.getItem('user');
      return saved ? (JSON.parse(saved) as User) : null;
    } catch (e) {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = window.localStorage.getItem('registeredUsers');
        return saved ? JSON.parse(saved) : [...DEMO_USERS];
      }
    } catch (e) {
      // ignore
    }
    return [...DEMO_USERS];
  });

  // Get the API base URL dynamically
  const getApiBaseUrl = () => {
    // Use environment variable if available, otherwise construct from window location
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = '5000'; // Backend port
    return `${protocol}//${hostname}:${port}`;
  };

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    
    try {
      const apiUrl = `${getApiBaseUrl()}/api/auth/login`;
      console.log('🔐 Attempting login to:', apiUrl);
      console.log('📧 Email:', credentials.email);
      console.log('🔑 Password length:', credentials.password?.length);
      
      // Make real API call to backend
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      console.log('📡 Response status:', response.status);
      const result = await response.json();
      console.log('📦 Response data:', result);

      if (!response.ok) {
        console.error('❌ Login failed:', result.error);
        throw new Error(result.error || 'Login failed');
      }

      // Create user object from backend response
      const loggedInUser: User = {
        id: result.data.user.id,
        name: result.data.user.name,
        email: result.data.user.email,
        role: result.data.user.role,
      };

      console.log('✅ Login successful:', loggedInUser);
      setUser(loggedInUser);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('user', JSON.stringify(loggedInUser));
        window.localStorage.setItem('token', result.data.token); // Store JWT token
      }
      setIsLoading(false);
    } catch (error: any) {
      console.error('💥 Login error:', error);
      setIsLoading(false);
      throw new Error(error.message || 'Invalid credentials');
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    
    try {
      // Make real API call to backend
      const response = await fetch(`${getApiBaseUrl()}/api/auth/register`, {
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
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      }
      
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || 'Registration failed');
    }
  };

  // Keep localStorage in sync with user state (handles manual logout/login elsewhere)
  useEffect(() => {
    try {
      if (user) {
        window.localStorage.setItem('user', JSON.stringify(user));
      } else {
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('token');
      }
    } catch (e) {
      // ignore localStorage errors
    }
  }, [user]);

  const logout = async () => {
    try {
      // Call backend logout endpoint
      const token = window.localStorage.getItem('token');
      if (token) {
        await fetch(`${getApiBaseUrl()}/api/auth/logout`, {
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
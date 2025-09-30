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
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('registeredUsers');
    return saved ? JSON.parse(saved) : [...DEMO_USERS];
  });

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email exists in registered users (password is ignored for demo)
    const foundUser = registeredUsers.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      setIsLoading(false);
    } else {
      setIsLoading(false);
      throw new Error('Invalid credentials. User not found.');
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    const emailExists = registeredUsers.some(u => u.email.toLowerCase() === data.email.toLowerCase());
    
    if (emailExists) {
      setIsLoading(false);
      throw new Error('Email already registered');
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: 'member',
    };

    // Update registered users
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
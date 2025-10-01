import React from 'react';
import { LogOut, Database, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onNavigateToDatabase?: () => void;
  onNavigateToLoginHistory?: () => void;
  showDatabaseButton?: boolean;
  showLoginHistoryButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onNavigateToDatabase, 
  onNavigateToLoginHistory,
  showDatabaseButton = false,
  showLoginHistoryButton = false
}) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{user.name}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-normal">{user.email}</div>
          </div>
          {user.role === 'admin' && (
            <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-sm">
              Admin
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'admin' && showDatabaseButton && onNavigateToDatabase && (
            <button
              onClick={onNavigateToDatabase}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg"
              title="View Database"
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Database</span>
            </button>
          )}
          {user.role === 'admin' && showLoginHistoryButton && onNavigateToLoginHistory && (
            <button
              onClick={onNavigateToLoginHistory}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg"
              title="View Login History"
            >
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Login Activity</span>
            </button>
          )}
          <ThemeToggle />
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 font-medium"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
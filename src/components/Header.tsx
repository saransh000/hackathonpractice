import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Database, Activity, User, Mail, Shield, Calendar } from 'lucide-react';
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
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-300 relative z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 relative z-50" ref={dropdownRef}>
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 cursor-pointer group"
            title="View profile details"
          >
            <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {user.name}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-normal">{user.email}</div>
            </div>
            {user.role === 'admin' && (
              <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-sm">
                Admin
              </span>
            )}
          </button>

          {/* User Details Dropdown */}
          {showUserDropdown && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[9999] overflow-hidden animate-fade-in-up">
              {/* Header */}
              <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold tracking-tight">{user.name}</h3>
                    <p className="text-sm text-blue-100 font-medium">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Full Name</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user.name}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Mail className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Email Address</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Role</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">{user.role}</span>
                      {user.role === 'admin' && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">User ID</div>
                    <div className="text-sm font-mono font-semibold text-gray-900 dark:text-gray-100 truncate">{user.id}</div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
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
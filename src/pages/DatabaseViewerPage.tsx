import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, Users, Shield, Calendar, Mail, User, TrendingUp } from 'lucide-react';

interface DatabaseUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
}

interface DatabaseStats {
  totalUsers: number;
  adminUsers: number;
  memberUsers: number;
  todaySignups: number;
  thisWeekSignups: number;
}

export const DatabaseViewerPage: React.FC = () => {
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [stats, setStats] = useState<DatabaseStats>({
    totalUsers: 0,
    adminUsers: 0,
    memberUsers: 0,
    todaySignups: 0,
    thisWeekSignups: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDatabaseData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all users from backend
      const token = window.localStorage.getItem('token') || '';
      const response = await fetch('http://172.26.81.221:5000/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch database information');
      }

      const result = await response.json();
      const usersData = result.data || [];
      
      setUsers(usersData);
      
      // Calculate statistics
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const adminCount = usersData.filter((u: DatabaseUser) => u.role === 'admin').length;
      const memberCount = usersData.filter((u: DatabaseUser) => u.role === 'member').length;
      const todayCount = usersData.filter((u: DatabaseUser) => 
        new Date(u.createdAt) >= today
      ).length;
      const weekCount = usersData.filter((u: DatabaseUser) => 
        new Date(u.createdAt) >= weekAgo
      ).length;

      setStats({
        totalUsers: usersData.length,
        adminUsers: adminCount,
        memberUsers: memberCount,
        todaySignups: todayCount,
        thisWeekSignups: weekCount,
      });
      
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to load database information');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabaseData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Database className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black font-['Poppins'] bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Database Viewer
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-['Inter']">
                  Real-time MongoDB user data
                </p>
              </div>
            </div>
            
            <button
              onClick={fetchDatabaseData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 font-['Inter'] font-semibold shadow-lg hover:shadow-xl"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 font-['Inter']">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-black font-['Poppins'] text-gray-900 dark:text-white">
                {stats.totalUsers}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-['Inter']">Total Users</p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-black font-['Poppins'] text-gray-900 dark:text-white">
                {stats.adminUsers}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-['Inter']">Admins</p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <User className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-black font-['Poppins'] text-gray-900 dark:text-white">
                {stats.memberUsers}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-['Inter']">Members</p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-black font-['Poppins'] text-gray-900 dark:text-white">
                {stats.todaySignups}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-['Inter']">Today</p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span className="text-2xl font-black font-['Poppins'] text-gray-900 dark:text-white">
                {stats.thisWeekSignups}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-['Inter']">This Week</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-xl">
            <p className="text-red-700 dark:text-red-400 font-['Inter']">{error}</p>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-indigo-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold font-['Poppins'] text-white uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold font-['Poppins'] text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold font-['Poppins'] text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold font-['Poppins'] text-white uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold font-['Poppins'] text-white uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold font-['Poppins'] text-white uppercase tracking-wider">
                    Time Ago
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold font-['Poppins'] text-white uppercase tracking-wider">
                    User ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 font-['Inter']">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Loading database...
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 font-['Inter']">
                      No users found in database
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr
                      key={user._id}
                      className="hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold font-['Inter'] text-gray-900 dark:text-white">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold font-['Poppins'] text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-semibold font-['Inter'] text-gray-900 dark:text-white">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-['Inter'] text-gray-700 dark:text-gray-300">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold font-['Inter'] ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          }`}
                        >
                          {user.role === 'admin' ? (
                            <Shield className="h-3 w-3" />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-['Inter'] text-gray-700 dark:text-gray-300">
                          {formatDate(user.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-['Inter'] text-gray-500 dark:text-gray-400">
                          {getTimeAgo(user.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                          {user._id}
                        </code>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 font-['Inter']">
          <p>Connected to MongoDB • Real-time data from backend API</p>
        </div>
      </div>
    </div>
  );
};

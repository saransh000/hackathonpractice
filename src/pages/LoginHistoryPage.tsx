import React, { useState, useEffect } from 'react';
import { Activity, Clock, MapPin, Monitor, Calendar, Users, LogIn, RefreshCw } from 'lucide-react';

interface LoginSession {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  loginTime: string;
  logoutTime?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionDuration?: number;
  isActive: boolean;
}

interface LoginStats {
  totalLogins: number;
  activeSessions: number;
  loginsToday: number;
  loginsThisWeek: number;
  uniqueUsersToday: number;
  avgSessionDuration: number;
  mostActiveUsers: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    loginCount: number;
    lastLogin: string;
  }>;
}

export const LoginHistoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<LoginSession[]>([]);
  const [stats, setStats] = useState<LoginStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchLoginData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = window.localStorage.getItem('token') || '';
      
      // Fetch login sessions
      const sessionsResponse = await fetch('http://172.26.81.221:5000/api/admin/login-history?limit=50', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Fetch login statistics
      const statsResponse = await fetch('http://172.26.81.221:5000/api/admin/login-stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!sessionsResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch login data');
      }

      const sessionsResult = await sessionsResponse.json();
      const statsResult = await statsResponse.json();
      
      setSessions(sessionsResult.data || []);
      setStats(statsResult.data || null);
      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch login data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginData();
  }, []);

  const formatDuration = (seconds: number | undefined): string => {
    if (!seconds) return 'N/A';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getBrowserFromUserAgent = (userAgent: string | undefined): string => {
    if (!userAgent) return 'Unknown';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    
    return 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-2">
              Login Activity Monitor
            </h1>
            <p className="text-gray-600 font-medium">
              Track user sessions and login statistics
            </p>
          </div>
          <button
            onClick={fetchLoginData}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-2xl">
            <p className="font-semibold">Error: {error}</p>
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <LogIn className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-800">{stats.loginsToday}</span>
              </div>
              <p className="text-gray-600 font-medium">Logins Today</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold text-gray-800">{stats.activeSessions}</span>
              </div>
              <p className="text-gray-600 font-medium">Active Sessions</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold text-gray-800">{stats.uniqueUsersToday}</span>
              </div>
              <p className="text-gray-600 font-medium">Unique Users Today</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-orange-600" />
                <span className="text-2xl font-bold text-gray-800">{formatDuration(stats.avgSessionDuration)}</span>
              </div>
              <p className="text-gray-600 font-medium">Avg Session Time</p>
            </div>
          </div>
        )}

        {/* Login Sessions Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6" />
              Recent Login Sessions
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading login history...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No login sessions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Login Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">IP Address</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Browser</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sessions.map((session) => (
                    <tr key={session._id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                            {session.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{session.user.name}</p>
                            <p className="text-sm text-gray-500">{session.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{formatTimeAgo(session.loginTime)}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(session.loginTime).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{formatDuration(session.sessionDuration)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="font-mono text-sm">{session.ipAddress || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Monitor className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{getBrowserFromUserAgent(session.userAgent)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            session.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {session.isActive ? '● Active' : '○ Ended'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Last Updated */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

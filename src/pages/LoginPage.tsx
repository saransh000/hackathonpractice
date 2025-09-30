import React, { useState } from 'react';
import { LogIn, Mail, Lock, Loader2, Users, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { LoginCredentials } from '../types/auth';
import { SignupPage } from './SignupPage';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Show signup page if requested
  if (showSignup) {
    return <SignupPage onBackToLogin={() => setShowSignup(false)} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(credentials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const demoUsers = [
    { name: 'Alex Chen', email: 'alex@hackathon.com', role: 'Admin' },
    { name: 'Sarah Kim', email: 'sarah@hackathon.com', role: 'Member' },
    { name: 'Mike Johnson', email: 'mike@hackathon.com', role: 'Member' },
    { name: 'Emma Davis', email: 'emma@hackathon.com', role: 'Member' },
  ];

  const quickLogin = (email: string) => {
    setCredentials({ email, password: 'demo123' });
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-6xl flex gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-1 flex-col gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-display font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-tight">
                Hackathon Helper
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
              Organize your hackathon projects with ease
            </p>
          </div>

          <div className="space-y-4">
            <Feature icon={<CheckCircle className="h-5 w-5" />} text="Drag & drop task management" />
            <Feature icon={<CheckCircle className="h-5 w-5" />} text="Real-time team collaboration" />
            <Feature icon={<CheckCircle className="h-5 w-5" />} text="Beautiful dark mode interface" />
            <Feature icon={<CheckCircle className="h-5 w-5" />} text="Priority-based task organization" />
          </div>

          <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-900 dark:text-gray-100">Join 1,000+ Teams</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Trusted by hackathon teams worldwide to build amazing projects
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 max-w-md w-full">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4 lg:hidden">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-normal">
                Sign in to manage your hackathon projects
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowDemo(!showDemo)}
                className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
              >
                {showDemo ? '← Hide Demo Accounts' : '👀 View Demo Accounts'}
              </button>

              {showDemo && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 space-y-2 animate-slide-up">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Click any email to quick login (password not required for demo):
                  </p>
                  {demoUsers.map((user) => (
                    <button
                      key={user.email}
                      onClick={() => quickLogin(user.email)}
                      className="w-full text-left p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{user.email}</div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full">
                          {user.role}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button 
                  onClick={() => setShowSignup(true)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

const Feature: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
    <div className="text-green-600 dark:text-green-400">{icon}</div>
    <span>{text}</span>
  </div>
);
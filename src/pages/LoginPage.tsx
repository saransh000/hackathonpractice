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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 dark:bg-blue-300 rounded-full animate-float-particle"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-indigo-400 dark:bg-indigo-300 rounded-full animate-float-particle-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-purple-400 dark:bg-purple-300 rounded-full animate-float-particle-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-cyan-400 dark:bg-cyan-300 rounded-full animate-float-particle"></div>
        <div className="absolute bottom-1/4 right-20 w-3 h-3 bg-pink-400 dark:bg-pink-300 rounded-full animate-float-particle-delayed"></div>
        
        {/* Circuit-like lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-5" style={{ animationDelay: '2s' }}>
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="1" className="text-blue-500 animate-draw-line" strokeDasharray="10,10" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-indigo-500 animate-draw-line" strokeDasharray="10,10" style={{ animationDelay: '0.5s' }} />
        </svg>
      </div>

      <div className="w-full max-w-6xl flex gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-1 flex-col gap-8 animate-fade-in-left">
          <div className="space-y-6">
            {/* New Logo with pulse glow effect */}
            <div className="flex flex-col items-center justify-center mb-8 relative">
              {/* Glowing ring behind logo */}
              <div className="absolute inset-0 w-64 h-64 mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 blur-2xl animate-pulse-glow"></div>
              </div>
              <img 
                src="/hackathon-helper-logo.png" 
                alt="Hackathon Helper" 
                className="w-64 h-64 object-contain drop-shadow-2xl animate-float relative z-10 hover:scale-110 transition-transform duration-500"
              />
              {/* Sparkle effects */}
              <div className="absolute top-10 left-10 w-4 h-4 animate-sparkle">
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="absolute bottom-20 right-10 w-3 h-3 animate-sparkle-delayed">
                <Sparkles className="w-3 h-3 text-blue-400" />
              </div>
            </div>
            <p className="text-xl text-center text-gray-600 dark:text-gray-400 font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Organize your hackathon projects with ease
            </p>
          </div>

          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Feature icon={<CheckCircle className="h-5 w-5" />} text="Drag & drop task management" delay="0.5s" />
            <Feature icon={<CheckCircle className="h-5 w-5" />} text="Real-time team collaboration" delay="0.6s" />
            <Feature icon={<CheckCircle className="h-5 w-5" />} text="Beautiful dark mode interface" delay="0.7s" />
            <Feature icon={<CheckCircle className="h-5 w-5" />} text="Priority-based task organization" delay="0.8s" />
          </div>

          <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-bounce-subtle" />
              <span className="font-semibold text-gray-900 dark:text-gray-100">Join 1,000+ Teams</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Trusted by hackathon teams worldwide to build amazing projects
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 max-w-md w-full animate-fade-in-right">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-blue-500/20 hover:shadow-3xl hover:border-blue-300 dark:hover:border-blue-700 relative overflow-hidden group">
            {/* Animated gradient border on hover */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 animate-gradient"></div>
            </div>
            
            <div className="relative z-10">
              <div className="text-center mb-8 animate-fade-in-up">
                <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4 lg:hidden animate-bounce-subtle">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
                  <span className="inline-block hover:scale-110 transition-transform duration-300">Welcome</span>{' '}
                  <span className="inline-block hover:scale-110 transition-transform duration-300" style={{ transitionDelay: '50ms' }}>Back</span>
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
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:scale-110 transition-transform duration-300 inline-block"
                >
                  Sign up
                </button>
              </p>
            </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

const Feature: React.FC<{ icon: React.ReactNode; text: string; delay?: string }> = ({ icon, text, delay = '0s' }) => (
  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 animate-fade-in-left group hover:translate-x-2 transition-all duration-300" style={{ animationDelay: delay }}>
    <div className="text-green-600 dark:text-green-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">{icon}</div>
    <span className="group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">{text}</span>
  </div>
);
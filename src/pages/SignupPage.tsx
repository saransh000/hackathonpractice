import React, { useState, useMemo } from 'react';
import { UserPlus, Mail, Lock, User, Loader2, ArrowLeft, CheckCircle, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PasswordValidation {
  minLength: boolean;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  allValid: boolean;
}

interface SignupPageProps {
  onBackToLogin: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onBackToLogin }) => {
  const { signup, isLoading } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Real-time password validation
  const passwordValidation = useMemo((): PasswordValidation => {
    const password = formData.password;
    return {
      minLength: password.length >= 6,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      allValid: password.length >= 6 && 
                /[a-z]/.test(password) && 
                /[A-Z]/.test(password) && 
                /\d/.test(password)
    };
  }, [formData.password]);

  // Check if form is valid for submission
  const isFormValid = useMemo(() => {
    return (
      formData.name.trim().length >= 2 &&
      formData.email.trim().length > 0 &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      passwordValidation.allValid &&
      formData.password === formData.confirmPassword &&
      formData.confirmPassword.length > 0
    );
  }, [formData, passwordValidation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Prevent submission if form is not valid
    if (!isFormValid) {
      setError('Please fix all validation errors before submitting');
      return;
    }

    // Additional validation checks
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    if (!passwordValidation.allValid) {
      setError('Password must meet all requirements');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setSuccess(true);
      setTimeout(() => {
        onBackToLogin();
      }, 2000);
    } catch (err: any) {
      // Show specific validation errors from backend
      if (err.response?.data?.details) {
        const validationErrors = err.response.data.details
          .map((detail: any) => detail.msg)
          .join(', ');
        setError(validationErrors);
      } else {
        setError(err.response?.data?.error || err.message || 'Signup failed');
      }
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
        <div className="glass-effect p-8 rounded-2xl max-w-md w-full text-center shadow-lg">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold gradient-text mb-2 tracking-tight">Account Created!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Welcome to Hackathon Helper! Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-effect p-8 rounded-2xl shadow-lg">
          {/* Back Button */}
          <button
            onClick={onBackToLogin}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Login</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/hackathon-helper-logo.png" 
                alt="Hackathon Helper" 
                className="w-32 h-32 object-contain drop-shadow-xl"
              />
            </div>
            <h1 className="text-3xl font-display font-black gradient-text mb-2 tracking-tight">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-400 font-normal">
              Join Hackathon Helper and start collaborating
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="Create a password"
                  disabled={isLoading}
                />
              </div>
              
              {/* Password Requirements Indicator */}
              {formData.password.length > 0 && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Password Requirements:
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      {passwordValidation.minLength ? (
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${passwordValidation.minLength ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        At least 6 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordValidation.hasLowercase ? (
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${passwordValidation.hasLowercase ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        One lowercase letter (a-z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordValidation.hasUppercase ? (
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${passwordValidation.hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        One uppercase letter (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordValidation.hasNumber ? (
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${passwordValidation.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        One number (0-9)
                      </span>
                    </div>
                  </div>
                  {passwordValidation.allValid && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                          All requirements met! ✓
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
              </div>
              
              {/* Password Match Indicator */}
              {formData.confirmPassword.length > 0 && (
                <div className="mt-2">
                  {formData.password === formData.confirmPassword ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Check className="h-4 w-4" />
                      <span className="text-xs font-medium">Passwords match</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <X className="h-4 w-4" />
                      <span className="text-xs font-medium">Passwords do not match</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`w-full btn-primary flex items-center justify-center gap-2 transition-all ${
                !isFormValid && !isLoading
                  ? 'opacity-50 cursor-not-allowed bg-gray-400 dark:bg-gray-600'
                  : ''
              }`}
              title={!isFormValid ? 'Please complete all requirements' : ''}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
            
            {/* Disabled Button Message */}
            {!isFormValid && !isLoading && (
              <div className="text-center">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  ⚠️ Complete all requirements to create account
                </p>
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                onClick={onBackToLogin}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

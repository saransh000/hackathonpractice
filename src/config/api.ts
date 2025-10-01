// API Configuration
// This file exports the API base URL based on the environment

/**
 * Get the API base URL based on the current environment
 * - In production: Uses VITE_API_URL from environment variables
 * - In development: Uses localhost or current hostname with port 5000
 */
export const getApiBaseUrl = (): string => {
  // Check if we have a production API URL set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // For development, use dynamic hostname with port 5000
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:5000`;
};

// Export the API URL
export const API_BASE_URL = getApiBaseUrl();

// Export API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/health`,
  
  // Messages
  MESSAGES: `${API_BASE_URL}/api/messages`,
  
  // Admin
  ADMIN: `${API_BASE_URL}/api/admin`,
};

export default API_BASE_URL;

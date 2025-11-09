// ========================================
// API CLIENT
// ========================================
// Axios instance configured to talk to your Express backend

import axios from 'axios';

/**
 * WHAT IS THIS?
 * This creates a configured axios instance that:
 * 1. Points to your backend API
 * 2. Automatically adds auth token to requests
 * 3. Handles errors consistently
 * 4. Automatically refreshes expired tokens
 */

// Base URL of your backend API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds - increased for slower connections
});

/**
 * REQUEST INTERCEPTOR
 * Runs BEFORE every request
 * Adds JWT token to Authorization header
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    // (We'll store it there after login)
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Runs AFTER every request
 * Handles errors globally and refreshes tokens automatically
 */
apiClient.interceptors.response.use(
  (response) => {
    // If successful, just return the data
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorMessage = error.response?.data?.error || '';

      // Check if it's a token expiration error
      if (errorMessage.includes('Token expired')) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Try to refresh the token
          const response = await apiClient.post('/auth/refresh');
          const { token, user } = response.data;

          // Update token in localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));

          // Update auth header
          apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + token;
          originalRequest.headers['Authorization'] = 'Bearer ' + token;

          // Process queued requests
          processQueue(null, token);

          // Retry original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          processQueue(refreshError, null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else if (errorMessage.includes('Invalid token')) {
        // Invalid token, logout immediately
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    // Don't auto-logout on network errors or timeouts
    return Promise.reject(error);
  }
);

export default apiClient;

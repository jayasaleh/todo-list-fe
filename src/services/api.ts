import axios from 'axios';

// API Configuration
const API_BASE_URL =
  import.meta.env?.VITE_API_URL || 'http://localhost:8080/api';

// Response types from backend
export interface ApiResponse<T> {
  code: number;
  status: string;
  message: string;
  data?: T;
}

export interface PaginatedApiResponse<T> {
  code: number;
  status: string;
  message: string;
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiError {
  code: number;
  status: string;
  message: string;
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: any) => {
    // Handle common errors
    if (error.response) {
      const apiError = error.response.data as ApiError;
      const errorMessage = apiError?.message || error.response.statusText || 'An error occurred';
      console.error('API Error:', {
        status: error.response.status,
        message: errorMessage,
        data: error.response.data,
      });
      return Promise.reject({
        message: errorMessage,
        code: error.response.status,
        response: error.response,
      });
    }

    if (error.request) {
      console.error('Network Error:', error.request);
      return Promise.reject({
        message: 'Network error. Please check your connection and ensure backend is running.',
        code: 0,
      });
    }

    console.error('Unknown Error:', error);
    return Promise.reject({
      message: error.message || 'An unexpected error occurred',
      code: 500,
    });
  }
);

export default apiClient;

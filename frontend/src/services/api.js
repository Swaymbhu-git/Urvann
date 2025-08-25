import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          console.error('Bad Request:', data.message);
          break;
        case 404:
          console.error('Not Found:', data.message);
          break;
        case 500:
          console.error('Server Error:', data.message);
          break;
        default:
          console.error('HTTP Error:', status, data.message);
      }
      
      // Return structured error
      return Promise.reject({
        message: data.message || 'An error occurred',
        status,
        errors: data.errors || null
      });
    } else if (error.request) {
      // Network error
      console.error('Network Error:', error.message);
      return Promise.reject({
        message: 'Unable to connect to server. Please check your internet connection.',
        status: 0,
        errors: null
      });
    } else {
      // Other error
      console.error('Error:', error.message);
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        status: 0,
        errors: null
      });
    }
  }
);

// Plant API methods
export const plantAPI = {
  // Get all plants with optional search and filter parameters
  getAllPlants: async (params = {}) => {
    try {
      const response = await api.get('/plants', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new plant
  createPlant: async (plantData) => {
    try {
      const response = await api.post('/plants', plantData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get plant by ID
  getPlantById: async (id) => {
    try {
      const response = await api.get(`/plants/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.get('/plants/categories');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Utility function to handle API errors consistently
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return error.message || defaultMessage;
};

// Helper function to build search parameters
export const buildSearchParams = (searchTerm, category) => {
  const params = {};
  
  if (searchTerm && searchTerm.trim()) {
    params.search = searchTerm.trim();
  }
  
  if (category && category !== 'all' && category !== '') {
    params.category = category;
  }
  
  return params;
};

export default api;
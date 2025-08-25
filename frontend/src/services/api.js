import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
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
      
      return Promise.reject({
        message: data.message || 'An error occurred',
        status,
        errors: data.errors || null
      });
    } else if (error.request) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        message: 'Unable to connect to server. Please check your internet connection.',
        status: 0,
        errors: null
      });
    } else {
      console.error('Error:', error.message);
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        status: 0,
        errors: null
      });
    }
  }
);

export const plantAPI = {
  getAllPlants: async (params = {}) => {
    try {
      const response = await api.get('/plants', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createPlant: async (plantData) => {
    try {
      const response = await api.post('/plants', plantData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPlantById: async (id) => {
    try {
      const response = await api.get(`/plants/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get('/plants/categories');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return error.message || defaultMessage;
};

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
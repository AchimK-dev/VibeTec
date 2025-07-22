import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_VIBETEC_API_URL || '/api',
  withCredentials: true,
});

// Add response interceptor to handle 401 errors silently
axiosInstance.interceptors.response.use(
  (response) => {
    // Return successful responses as is
    return response;
  },
  (error) => {
    // Don't log 401 errors to console as they are expected for non-authenticated users
    if (error.response?.status === 401) {
      // Silently reject the promise without console output
      return Promise.reject(error);
    }
    
    // For other errors, allow normal error handling
    return Promise.reject(error);
  }
);

export default axiosInstance;

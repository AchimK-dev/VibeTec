import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_VIBETEC_API_URL || '/api',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;

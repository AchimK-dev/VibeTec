import axiosInstance from '@/config/axiosConfig';

const baseURL = `/auth`;

export const me = async () => {
  try {
    const res = await axiosInstance(`${baseURL}/me`);
    return res.data;
  } catch (error) {
    // Don't log 401 errors as they are expected when user is not logged in
    if (error.response?.status === 401) {
      // User not authenticated - return null silently
      return null;
    }
    return null;
  }
};

export const signin = async (formData) => {
  try {
    const res = await axiosInstance.post(`${baseURL}/signin`, formData);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else {
      return { error: 'An unexpected error occurred while signin' };
    }
  }
};

export const signup = async (formData) => {
  try {
    const res = await axiosInstance.post(`${baseURL}/signup`, formData);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else {
      return { error: 'An unexpected error occurred while signup' };
    }
  }
};
export const signout = async () => {
  try {
    const res = await axiosInstance.delete(`${baseURL}/signout`);
  } catch (error) {
    return { error: 'An unexpected error occurred while signout' };
  }
};

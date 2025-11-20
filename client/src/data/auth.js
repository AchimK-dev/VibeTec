import axiosInstance from "@/config/axiosConfig";

const baseURL = `/auth`;

export const me = async () => {
  try {
    const res = await axiosInstance(`${baseURL}/me`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
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
    if (!error.response) {
      return {
        error:
          "Unable to connect to server. Please check your internet connection.",
      };
    }
    if (error.response) {
      return error.response.data;
    }
    return { error: "An unexpected error occurred during login." };
  }
};

export const signup = async (formData) => {
  try {
    const res = await axiosInstance.post(`${baseURL}/signup`, formData);
    return res.data;
  } catch (error) {
    if (!error.response) {
      return {
        error:
          "Unable to connect to server. Please check your internet connection.",
      };
    }
    if (error.response) {
      return error.response.data;
    }
    return { error: "An unexpected error occurred during registration." };
  }
};

export const signout = async () => {
  try {
    await axiosInstance.delete(`${baseURL}/signout`);
    return { success: true };
  } catch (error) {
    if (!error.response) {
      return { error: "Unable to connect to server." };
    }
    return { error: "An unexpected error occurred during logout." };
  }
};

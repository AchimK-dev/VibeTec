import axiosInstance from "@/config/axiosConfig";

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axiosInstance.put("/users/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to change password"
    );
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/users/all");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get users");
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update user role"
    );
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put(
      "/users/update-profile",
      profileData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
};

export const updatePhoneNumber = async (phoneNumber) => {
  try {
    const response = await axiosInstance.put("/users/update-phone", {
      phoneNumber,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update phone number"
    );
  }
};

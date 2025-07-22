import axiosInstance from '@/config/axiosConfig';

// Change user password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axiosInstance.put('/users/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};

// Get all users (Admin only)
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/users/all');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get users');
  }
};

// Delete user (Admin only)
export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};

// Update user role (Admin only)
export const updateUserRole = async (userId, role) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update user role');
  }
};

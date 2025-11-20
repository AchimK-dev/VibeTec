import api from "../config/axiosConfig";

const baseURL = `/bookings`;

const handleApiError = (error, fallbackMessage) => {
  if (!error.response) {
    throw new Error(
      "Unable to connect to server. Please check your internet connection."
    );
  }
  throw new Error(error.response?.data?.message || fallbackMessage);
};

export const getAllBookings = async () => {
  try {
    const { data } = await api.get(baseURL);
    return data;
  } catch (error) {
    handleApiError(error, "Failed to load bookings.");
  }
};

export const getPendingBookings = async () => {
  try {
    const { data } = await api.get(`${baseURL}/pending`);
    return data;
  } catch (error) {
    handleApiError(error, "Failed to load pending bookings.");
  }
};

export const confirmBooking = async (artistId, bookingId) => {
  try {
    const { data } = await api.patch(
      `${baseURL}/confirm/${artistId}/${bookingId}`
    );
    return data;
  } catch (error) {
    handleApiError(error, "Failed to confirm booking.");
  }
};

export const rejectBooking = async (artistId, bookingId) => {
  try {
    const { data } = await api.delete(
      `${baseURL}/reject/${artistId}/${bookingId}`
    );
    return data;
  } catch (error) {
    handleApiError(error, "Failed to reject booking.");
  }
};

export const getUserBookings = async () => {
  try {
    const { data } = await api.get(`${baseURL}/my-bookings`);
    return data;
  } catch (error) {
    handleApiError(error, "Failed to load your bookings.");
  }
};

export const updateBooking = async (bookingId, updateData) => {
  try {
    const { data } = await api.patch(`${baseURL}/${bookingId}`, updateData);
    return data;
  } catch (error) {
    handleApiError(error, "Failed to update booking.");
  }
};

export const deleteBooking = async (bookingId) => {
  try {
    const { data } = await api.delete(`${baseURL}/${bookingId}`);
    return data;
  } catch (error) {
    handleApiError(error, "Failed to cancel booking.");
  }
};

export const deleteBookingByAdmin = async (bookingId) => {
  try {
    const { data } = await api.delete(`${baseURL}/admin/${bookingId}`);
    return data;
  } catch (error) {
    handleApiError(error, "Failed to delete booking.");
  }
};

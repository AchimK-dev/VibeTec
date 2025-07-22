import api from '../config/axiosConfig';

const baseURL = `/bookings`;

// Get all bookings (Admin only)
export const getAllBookings = async () => {
  const { data } = await api.get(baseURL);
  return data;
};

// Get pending bookings (Admin only)
export const getPendingBookings = async () => {
  const { data } = await api.get(`${baseURL}/pending`);
  return data;
};

// Confirm a booking (Admin only)
export const confirmBooking = async (artistId, bookingId) => {
  const { data } = await api.patch(`${baseURL}/confirm/${artistId}/${bookingId}`);
  return data;
};

// Reject/Cancel a booking (Admin only)
export const rejectBooking = async (artistId, bookingId) => {
  const { data } = await api.delete(`${baseURL}/reject/${artistId}/${bookingId}`);
  return data;
};

// Get user's own bookings
export const getUserBookings = async () => {
  const { data } = await api.get(`${baseURL}/my-bookings`);
  return data;
};

// Update a booking (User)
export const updateBooking = async (bookingId, updateData) => {
  const { data } = await api.patch(`${baseURL}/${bookingId}`, updateData);
  return data;
};

// Delete a booking (User)
export const deleteBooking = async (bookingId) => {
  const { data } = await api.delete(`${baseURL}/${bookingId}`);
  return data;
};

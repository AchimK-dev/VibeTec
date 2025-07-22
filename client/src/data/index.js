import { getArtists, getSingleArtist, createArtist, updateArtist, deleteArtist, checkAvailability, addBooking, getAvailableDates } from './artists';
import { getAllBookings, getPendingBookings, confirmBooking, rejectBooking, getUserBookings, updateBooking, deleteBooking } from './bookings';
import { changePassword, getAllUsers, deleteUser, updateUserRole } from './users';
import { me, signin, signup, signout } from './auth';
export { 
  getArtists,
  getSingleArtist,
  createArtist,
  updateArtist,
  deleteArtist,
  checkAvailability,
  addBooking,
  getAvailableDates,
  getAllBookings,
  getPendingBookings,
  confirmBooking,
  rejectBooking,
  getUserBookings,
  updateBooking,
  deleteBooking,
  changePassword,
  getAllUsers,
  deleteUser,
  updateUserRole,
  me, 
  signin, 
  signup, 
  signout 
};

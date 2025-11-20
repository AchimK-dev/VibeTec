import { Router } from 'express';
import {
  getAllBookings,
  confirmBooking,
  rejectBooking,
  getPendingBookings,
  getUserBookings,
  updateUserBooking,
  deleteUserBooking,
  deleteBookingByAdmin
} from '../controllers/bookings.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';
import verifyAdminOrDemo from '../middlewares/verifyAdminOrDemo.js';
import checkNotDemo from '../middlewares/checkNotDemo.js';
import triggerDemoActivity from '../middlewares/triggerDemoActivity.js';

const bookingRouter = Router();

bookingRouter.get('/', verifyToken, verifyAdminOrDemo, getAllBookings);
bookingRouter.get('/pending', verifyToken, verifyAdminOrDemo, getPendingBookings);

bookingRouter.patch('/confirm/:artistId/:bookingId', verifyToken, verifyAdmin, checkNotDemo, confirmBooking);
bookingRouter.delete('/reject/:artistId/:bookingId', verifyToken, verifyAdmin, checkNotDemo, rejectBooking);

bookingRouter.get('/my-bookings', verifyToken, getUserBookings);
bookingRouter.patch('/:bookingId', verifyToken, updateUserBooking);
bookingRouter.delete('/:bookingId', verifyToken, deleteUserBooking);
bookingRouter.delete('/admin/:bookingId', verifyToken, verifyAdmin, checkNotDemo, deleteBookingByAdmin);

export default bookingRouter;

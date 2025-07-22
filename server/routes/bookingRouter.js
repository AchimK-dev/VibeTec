import { Router } from 'express';
import { 
  getAllBookings, 
  confirmBooking, 
  rejectBooking, 
  getPendingBookings,
  getUserBookings,
  updateUserBooking,
  deleteUserBooking
} from '../controllers/bookings.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';

const bookingRouter = Router();

// User booking routes (require authentication only) - MUST come first!
bookingRouter.get('/my-bookings', verifyToken, getUserBookings);
bookingRouter.patch('/:bookingId', verifyToken, updateUserBooking);
bookingRouter.delete('/:bookingId', verifyToken, deleteUserBooking);

// Admin booking routes (require admin privileges)
bookingRouter.get('/', verifyToken, verifyAdmin, getAllBookings);
bookingRouter.get('/pending', verifyToken, verifyAdmin, getPendingBookings);
bookingRouter.patch('/confirm/:artistId/:bookingId', verifyToken, verifyAdmin, confirmBooking);
bookingRouter.delete('/reject/:artistId/:bookingId', verifyToken, verifyAdmin, rejectBooking);

export default bookingRouter;

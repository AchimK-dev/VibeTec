import { Router } from 'express';
import { 
  getAllArtists, 
  getSingleArtist, 
  createArtist, 
  updateArtist, 
  deleteArtist,
  checkAvailability,
  addBooking,
  getAvailableDates,
  getDetailedAvailability
} from '../controllers/artists.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';
import validateZod from '../middlewares/validateZod.js';
import { artistSchema, bookingSchema } from '../zod/schemas.js';

const artistRouter = Router();

// Public routes
artistRouter.get('/', getAllArtists);
artistRouter.get('/:id', getSingleArtist);
artistRouter.get('/:id/availability', checkAvailability);
artistRouter.get('/:id/available-dates', getAvailableDates);
artistRouter.get('/:id/detailed-availability', getDetailedAvailability);

// Protected routes - Admin only for CUD operations
artistRouter.post('/', verifyToken, verifyAdmin, validateZod(artistSchema), createArtist);
artistRouter.put('/:id', verifyToken, verifyAdmin, validateZod(artistSchema), updateArtist);
artistRouter.delete('/:id', verifyToken, verifyAdmin, deleteArtist);

// Protected routes - All authenticated users can book
artistRouter.post('/:id/booking', verifyToken, validateZod(bookingSchema), addBooking);

export default artistRouter;

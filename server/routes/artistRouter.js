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
import checkNotDemo from '../middlewares/checkNotDemo.js';
import validateZod from '../middlewares/validateZod.js';
import { artistSchema, bookingSchema } from '../zod/schemas.js';

const artistRouter = Router();

artistRouter.get('/', getAllArtists);
artistRouter.get('/:id', getSingleArtist);
artistRouter.get('/:id/availability', checkAvailability);
artistRouter.get('/:id/available-dates', getAvailableDates);
artistRouter.get('/:id/detailed-availability', getDetailedAvailability);

artistRouter.post('/', verifyToken, verifyAdmin, checkNotDemo, validateZod(artistSchema), createArtist);
artistRouter.put('/:id', verifyToken, verifyAdmin, checkNotDemo, validateZod(artistSchema), updateArtist);
artistRouter.delete('/:id', verifyToken, verifyAdmin, checkNotDemo, deleteArtist);

artistRouter.post('/:id/booking', verifyToken, validateZod(bookingSchema), addBooking);

export default artistRouter;

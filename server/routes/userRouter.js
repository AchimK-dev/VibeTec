import express from 'express';
import {
  changePassword,
  getAllUsers,
  deleteUser,
  updateUserRole,
  updateProfile,
  updatePhoneNumber
} from '../controllers/users.js';
import verifyToken from '../middlewares/verifyToken.js';
import checkNotDemo from '../middlewares/checkNotDemo.js';
import validateZod from '../middlewares/validateZod.js';
import { changePasswordSchema, updateUserRoleSchema, updateProfileSchema } from '../zod/schemas.js';

const router = express.Router();

router.put('/change-password', verifyToken, checkNotDemo, validateZod(changePasswordSchema), changePassword);
router.put('/update-profile', verifyToken, checkNotDemo, validateZod(updateProfileSchema), updateProfile);
router.put('/update-phone', verifyToken, checkNotDemo, updatePhoneNumber);

router.get('/all', verifyToken, getAllUsers); // Admin can see all users
router.delete('/:userId', verifyToken, checkNotDemo, deleteUser); // Admin can delete users
router.put('/:userId/role', verifyToken, checkNotDemo, validateZod(updateUserRoleSchema), updateUserRole); // Admin can change user roles

export default router;

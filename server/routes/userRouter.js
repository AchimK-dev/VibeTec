import express from 'express';
import { changePassword, getAllUsers, deleteUser, updateUserRole } from '../controllers/users.js';
import verifyToken from '../middlewares/verifyToken.js';
import validateZod from '../middlewares/validateZod.js';
import { changePasswordSchema, updateUserRoleSchema } from '../zod/schemas.js';

const router = express.Router();

// User routes (protected)
router.put('/change-password', verifyToken, validateZod(changePasswordSchema), changePassword);

// Admin only routes
router.get('/all', verifyToken, getAllUsers); // Admin can see all users
router.delete('/:userId', verifyToken, deleteUser); // Admin can delete users
router.put('/:userId/role', verifyToken, validateZod(updateUserRoleSchema), updateUserRole); // Admin can change user roles

export default router;

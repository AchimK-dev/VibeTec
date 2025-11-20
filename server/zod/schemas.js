import { z } from 'zod/v4';

export const userSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string(),
  password: z.string().min(8).max(12)
});

// Login Schema - WITHOUT password length validation (only check during registration)
export const signInSchema = z.object({
  email: z.string(),
  password: z.string().min(1) // Only check if password is present
});

export const artistSchema = z.object({
  name: z.string('Name must be a string').min(1, 'Artist name is required'),
  musicGenre: z.string('Music genre must be a string').min(1, 'Music genre is required'),
  image: z.string('Image must be a string').min(1, 'Image is required'),
  description: z.string('Description must be a string').min(1, 'Description is required'),
  pricePerHour: z.coerce.number('Price must be a number').min(0, 'Price must be positive')
});

export const bookingSchema = z.object({
  date: z.string('Date must be a string').min(1, 'Date is required'),
  startTime: z.string('Start time must be a string').min(1, 'Start time is required'),
  endTime: z.string('End time must be a string').min(1, 'End time is required'),
  clientName: z.string('Client name must be a string').min(1, 'Client name is required'),
  eventDetails: z.string('Event details must be a string').optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string('Current password must be a string').min(1, 'Current password is required'),
  newPassword: z
    .string('New password must be a string')
    .min(8, 'New password must be at least 8 characters')
    .max(20, 'New password must be at most 20 characters')
});

export const updateUserRoleSchema = z.object({
  role: z.enum(['user', 'admin', 'demo'], 'Role must be either user, admin, or demo')
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Valid email is required').optional(),
  phoneNumber: z.string().optional(),
  password: z.string().min(1, 'Password is required for verification')
});

import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Change user password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Find user and explicitly select the password field
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    // Get all users (exclude passwords)
    const users = await User.find({}, '-password').sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is admin
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user role (Admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    // Check if user is admin
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    // Prevent admin from changing their own role
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    // Update user role (convert to uppercase to match schema)
    const upperCaseRole = role.toUpperCase();
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { role: upperCaseRole }, 
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User role updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

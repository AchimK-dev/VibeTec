import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'DEMO')) {
      return res.status(403).json({ message: 'Access denied. Admin or Demo role required.' });
    }

    let users = await User.find({}, '-password').sort({ createdAt: -1 });

    if (currentUser.role === 'DEMO') {
      users = users.map(user => {
        const anonymizeEmail = email => {
          if (!email) return email;
          const [local, domain] = email.split('@');
          const [domainName, tld] = domain.split('.');
          return (
            local.charAt(0) +
            '*'.repeat(Math.max(local.length - 1, 3)) +
            '@' +
            domainName.charAt(0) +
            '*'.repeat(Math.max(domainName.length - 1, 3)) +
            '.' +
            tld
          );
        };

        const anonymizeName = name => {
          if (!name) return name;
          return name.charAt(0) + '*'.repeat(Math.max(name.length - 1, 3));
        };

        return {
          ...user.toObject(),
          email: anonymizeEmail(user.email),
          firstName: anonymizeName(user.firstName),
          lastName: anonymizeName(user.lastName)
        };
      });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    if (userId === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    if (userId === req.user.id) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

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
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    const userId = req.user.id;

    // Verify password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    // Build update object with only provided fields
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, select: '-password' });

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only allow updating if phone number is not already set
    if (user.phoneNumber) {
      return res.status(400).json({ message: 'Phone number already set. Use profile update to change it.' });
    }

    // Update phone number
    const updatedUser = await User.findByIdAndUpdate(userId, { phoneNumber }, { new: true, select: '-password' });

    res.status(200).json({
      message: 'Phone number updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

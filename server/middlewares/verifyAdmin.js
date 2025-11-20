import User from '../models/User.js';

const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'Access denied. Admin privileges required.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default verifyAdmin;

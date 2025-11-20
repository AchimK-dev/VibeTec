import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Please sign in' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = { id: user._id.toString(), role: user.role };
    req.userId = user._id.toString();
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default verifyToken;

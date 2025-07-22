import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const me = async (req, res) => {
  const user = await User.findById(req.user?.id || req.userId).select('-password');
  res.status(200).json(user);
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid credentials', { cause: 401 });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials', { cause: 401 });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? 'None' : 'Lax',
    secure: isProduction
  };
  res.cookie('token', token, cookieOptions);
  res.status(201).json({ success: 'welcome back' });
};

export const signOut = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? 'None' : 'Lax',
    secure: isProduction
  };
  res.clearCookie('token', cookieOptions);
  res.status(200).json({ success: 'goodbye' });
};

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const alreadyExists = await User.findOne({ email });
  if (alreadyExists) throw new Error('User already exists', { cause: 400 });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword
  });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? 'None' : 'Lax',
    secure: isProduction
  };
  res.cookie('token', token, cookieOptions);
  res.status(201).json({ success: 'welcome aboard' });
};

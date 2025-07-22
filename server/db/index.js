import mongoose from 'mongoose';

try {
  const client = await mongoose.connect(process.env.MONGO_URI);
} catch (error) {
  console.error('MongoDB connection error:', error);
  process.exit(1);
}

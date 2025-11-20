import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vibetec';

async function createDemoUser() {
  try {
    // Connect to database
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if demo user already exists
    const existingDemo = await User.findOne({ email: 'demo@vibetec.com' });
    if (existingDemo) {
      console.log('ℹ️  Demo user already exists');

      // Update to latest version (if role not yet set)
      if (existingDemo.role !== 'DEMO') {
        existingDemo.role = 'DEMO';
        await existingDemo.save();
        console.log('✅ Demo user role updated to DEMO');
      }

      process.exit(0);
    }

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo', 10);

    const demoUser = new User({
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@vibetec.com',
      password: hashedPassword,
      role: 'DEMO'
    });

    await demoUser.save();
    console.log('✅ Demo user successfully created!');
    console.log('📧 Email: demo@vibetec.com');
    console.log('🔑 Password: demo');
    console.log('👤 Role: DEMO (Read-Only)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating demo user:', error.message);
    process.exit(1);
  }
}

createDemoUser();

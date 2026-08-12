import dns from 'node:dns';
import mongoose from 'mongoose';

// Force IPv4 to avoid Vercel DNS timeout
dns.setDefaultResultOrder('ipv4first');

const connectDatabase = async () => {
  // Already connected? Skip reconnecting
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in environment variables.');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

export default connectDatabase;
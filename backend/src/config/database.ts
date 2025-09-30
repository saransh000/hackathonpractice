import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon-helper';
    
    console.log('🔄 Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📤 MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📤 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error instanceof Error ? error.message : error);
    console.log('💡 To fix this:');
    console.log('   1. Install MongoDB: https://www.mongodb.com/try/download/community');
    console.log('   2. Start MongoDB service');
    console.log('   3. Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
    throw error; // Re-throw so server.ts can catch it
  }
};
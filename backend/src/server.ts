import dotenv from 'dotenv';
import { connectDB } from './config/database';
import createApp from './app';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Create app first
const app = createApp();

// Connect to MongoDB (optional - server will still run if this fails)
connectDB().catch((err) => {
  console.log('⚠️  MongoDB connection failed, but server will continue running');
  console.log('💡 You can still test the API structure, but database operations will fail');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 Admin API: http://localhost:${PORT}/api/admin/dashboard`);
});

export default app;
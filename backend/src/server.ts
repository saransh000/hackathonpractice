import dotenv from 'dotenv';
import http from 'http';
import { connectDB } from './config/database';
import createApp from './app';
import { initializeSocket } from './socket';

// Load environment variables
dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

// Create app first
const app = createApp();

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(httpServer);

// Connect to MongoDB (optional - server will still run if this fails)
connectDB().catch((err) => {
  console.log('⚠️  MongoDB connection failed, but server will continue running');
  console.log('💡 You can still test the API structure, but database operations will fail');
});

// Start server - Force IPv4 by binding to 0.0.0.0
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 Admin API: http://localhost:${PORT}/api/admin/dashboard`);
  console.log(`🔌 Socket.IO: Enabled for real-time sync`);
});

export default app;
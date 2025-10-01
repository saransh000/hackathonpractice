import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';

interface JoinRoomData {
  teamId: string;
  userId: string;
  userName: string;
}

interface TaskUpdateData {
  teamId: string;
  task: any;
  action: 'create' | 'update' | 'delete' | 'move';
}

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN 
        ? process.env.CORS_ORIGIN.split(',')
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
      credentials: true,
    },
  });

  // Store active users per team
  const activeUsers = new Map<string, Set<string>>();

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Join a team room
    socket.on('join-team', (data: JoinRoomData) => {
      const { teamId, userId, userName } = data;
      
      socket.join(`team-${teamId}`);
      
      // Track active users
      if (!activeUsers.has(teamId)) {
        activeUsers.set(teamId, new Set());
      }
      activeUsers.get(teamId)?.add(userId);

      // Notify others in the team
      socket.to(`team-${teamId}`).emit('user-joined', {
        userId,
        userName,
        timestamp: new Date().toISOString(),
      });

      // Send current active users to the new joiner
      const teamUsers = Array.from(activeUsers.get(teamId) || []);
      socket.emit('active-users', teamUsers);

      console.log(`👥 User ${userName} joined team ${teamId}`);
    });

    // Leave a team room
    socket.on('leave-team', (data: { teamId: string; userId: string; userName: string }) => {
      const { teamId, userId, userName } = data;
      
      socket.leave(`team-${teamId}`);
      
      // Remove from active users
      activeUsers.get(teamId)?.delete(userId);
      if (activeUsers.get(teamId)?.size === 0) {
        activeUsers.delete(teamId);
      }

      // Notify others
      socket.to(`team-${teamId}`).emit('user-left', {
        userId,
        userName,
        timestamp: new Date().toISOString(),
      });

      console.log(`👋 User ${userName} left team ${teamId}`);
    });

    // Task updates (create, update, delete, move)
    socket.on('task-update', (data: TaskUpdateData) => {
      const { teamId, task, action } = data;
      
      // Broadcast to all other users in the team
      socket.to(`team-${teamId}`).emit('task-updated', {
        task,
        action,
        timestamp: new Date().toISOString(),
      });

      console.log(`📝 Task ${action} in team ${teamId}`);
    });

    // Board column updates
    socket.on('column-update', (data: { teamId: string; columns: any }) => {
      const { teamId, columns } = data;
      
      socket.to(`team-${teamId}`).emit('columns-updated', {
        columns,
        timestamp: new Date().toISOString(),
      });

      console.log(`📋 Columns updated in team ${teamId}`);
    });

    // User is typing indicator
    socket.on('user-typing', (data: { teamId: string; userName: string; taskId: string }) => {
      socket.to(`team-${data.teamId}`).emit('user-typing-update', data);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.id}`);
      
      // Clean up active users (would need to track socket->user mapping for this)
      // For now, users will be removed when they explicitly leave
    });
  });

  return io;
};

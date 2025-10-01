import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://172.26.81.221:5000';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        withCredentials: true,
      });

      this.socket.on('connect', () => {
        console.log('🔌 Connected to Socket.IO server');
      });

      this.socket.on('disconnect', () => {
        console.log('🔌 Disconnected from Socket.IO server');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinTeam(teamId: string, userId: string, userName: string) {
    if (this.socket) {
      this.socket.emit('join-team', { teamId, userId, userName });
    }
  }

  leaveTeam(teamId: string, userId: string, userName: string) {
    if (this.socket) {
      this.socket.emit('leave-team', { teamId, userId, userName });
    }
  }

  emitTaskUpdate(teamId: string, task: any, action: 'create' | 'update' | 'delete' | 'move') {
    if (this.socket) {
      this.socket.emit('task-update', { teamId, task, action });
    }
  }

  emitColumnUpdate(teamId: string, columns: any) {
    if (this.socket) {
      this.socket.emit('column-update', { teamId, columns });
    }
  }

  onTaskUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('task-updated', callback);
    }
  }

  onColumnsUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('columns-updated', callback);
    }
  }

  onUserJoined(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user-joined', callback);
    }
  }

  onUserLeft(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user-left', callback);
    }
  }

  onActiveUsers(callback: (users: string[]) => void) {
    if (this.socket) {
      this.socket.on('active-users', callback);
    }
  }

  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();

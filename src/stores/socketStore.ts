import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,

  // 소켓 연결 함수
  connect: () => {
    // 이미 연결된 소켓이 있다면 중복 연결 방지
    if (get().socket) return;

    console.log('🔌 Attempting to connect to socket server...');
    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      set({ socket: newSocket, isConnected: true });
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected.');
      set({ socket: null, isConnected: false });
    });

    set({ socket: newSocket });
  },

  // 소켓 연결 해제 함수
  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));
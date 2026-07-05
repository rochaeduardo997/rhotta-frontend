import { io, Socket } from 'socket.io-client';

let socket: Socket | undefined;

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

const initializeSocket = (token: string) => {
  if (!token) return;
  socket = io(API_URL, {
    extraHeaders: { Authorization: `Bearer ${token}` }
  });
};

const getSocket = (token: string) => {
  if (!socket) initializeSocket(token);
  return socket;
};

export default getSocket;

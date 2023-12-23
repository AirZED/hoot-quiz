import { io, Socket } from "socket.io-client";

let socket: Socket;

export const connectWebSocket = () => {
  socket = io("http://localhost:8080");
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("WebSocket is not connected");
  }
  return socket;
};

import { io } from "socket.io-client";
import { API_BASE_URL } from "./constants";

let socket = null;

export const createSocketConnection = () => {
  if (socket) return socket;
  
  // Initialize Socket.io connection with explicit path handling for AWS Nginx
  const isLocal = location.hostname === "localhost";
  const socketUrl = isLocal ? "http://localhost:7777" : location.origin;
  const socketPath = isLocal ? "/socket.io" : "/api/socket.io";

  socket = io(socketUrl, {
    path: socketPath,
    withCredentials: true,
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

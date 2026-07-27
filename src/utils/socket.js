import { io } from "socket.io-client";
import { API_BASE_URL } from "./constants";

let socket = null;

export const createSocketConnection = () => {
  if (socket) return socket;
  
  // Initialize Socket.io connection
  socket = io(API_BASE_URL, {
    withCredentials: true,
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

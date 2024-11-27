// Maintain the websocket connection
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Create the WebSocket context with the type for the socket
const WebSocketContext = createContext<Socket | null>(null);

// Custom hook to use the WebSocket context
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

// Define the type for the WebSocket provider props, including children
interface WebSocketProviderProps {
  children: React.ReactNode; // The children prop is of type React.ReactNode
}

// WebSocketProvider component to manage the socket connection
export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!socket) {
      console.warn("Socket connection is not ready yet.");
    }
  }, [socket]);

  useEffect(() => {
    // Create the socket connection
    const socketConnection = io("http://localhost:3000", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 5000,
    });

    // Handle successful connection
    socketConnection.on('connect', () => {
      console.log('Socket connected:', socketConnection.id); // Log the socket ID
    });

    // Handle connection error
    socketConnection.on('connect_error', (error) => {
      console.error('Connection Error:', error);
    });

    // Handle reconnect error
    socketConnection.on('reconnect_error', (error) => {
      console.error('Reconnection Error:', error);
    });

    setSocket(socketConnection);
    console.log("WebSocket connection established and stored in state.");

    // Cleanup when the component unmounts
    return () => {
      console.log("Cleaning up WebSocket connection...");
      socketConnection.removeAllListeners();
      socketConnection.disconnect();
    };
  }, []);

  

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

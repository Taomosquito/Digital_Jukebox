import { jsx as _jsx } from "react/jsx-runtime";
// Maintain the websocket connection
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
// Create the WebSocket context with the type for the socket
const WebSocketContext = createContext(null);
// Custom hook to use the WebSocket context
export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
// WebSocketProvider component to manage the socket connection
export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
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
    return (_jsx(WebSocketContext.Provider, { value: socket, children: children }));
};

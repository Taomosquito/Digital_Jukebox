import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
const WebSocketContext = createContext(null);
export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
export const WebSocketProvider = ({ children, }) => {
    const [socket, setSocket] = useState(null);
    const [isSessionActive, setIsSessionActive] = useState(false);
    useEffect(() => {
        const existingSocketId = localStorage.getItem("socketId");
        if (existingSocketId) {
            alert("You already have an active session in another tab.");
            setIsSessionActive(true);
            return;
        }
        const socketConnection = io("http://localhost:3000", {
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000, // Wait 1 second between retries
            //timeout: 5000,
        });
        // Store the socket ID in localStorage when the connection is established. Check stale connection
        socketConnection.on("connect", () => {
            const newSocketId = socketConnection.id;
            if (newSocketId) {
                if (existingSocketId && existingSocketId !== newSocketId) {
                    console.log("Clearing stale socketId from localStorage.");
                    localStorage.removeItem("socketId");
                }
                console.log("Socket connected:", newSocketId);
                localStorage.setItem("socketId", newSocketId);
                setIsSessionActive(false); // Allow session after successful connection
            }
            else {
                console.error("Socket ID is undefined.");
            }
        });
        socketConnection.on("disconnect", () => {
            console.log("Socket disconnected");
            // localStorage.removeItem("socketId");
            setIsSessionActive(true);
        });
        // Handle reconnection
        socketConnection.on("reconnect", (attempt) => {
            console.log(`Reconnected successfully after ${attempt} attempt(s)`);
            setIsSessionActive(false); // Reset session block on reconnect
        });
        // Handle connection error
        socketConnection.on("connect_error", (error) => {
            console.error("Connection Error:", error);
        });
        // Handle reconnect error
        socketConnection.on("reconnect_error", (error) => {
            console.error("Reconnection Error:", error);
        });
        setSocket(socketConnection);
        console.log("WebSocket connection established and stored in state.");
        // Cleanup when the component unmounts
        return () => {
            console.log("Cleaning up WebSocket connection...");
            socketConnection.removeAllListeners();
            socketConnection.disconnect();
            localStorage.removeItem("socketId");
        };
    }, []);
    return (_jsx(WebSocketContext.Provider, { value: socket, children: isSessionActive /**TODO: For testing purpose, we can keep it (if True)create css styling separately, (else) or create other strategy */ ? (_jsx("div", { style: {
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
            }, children: _jsx("h2", { children: "You already have an active session. Please check your other tabs." }) })) : (children) }));
};

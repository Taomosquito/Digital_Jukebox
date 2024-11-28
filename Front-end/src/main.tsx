import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WebSocketProvider } from "./context/WebSocketContext";
import "./index.css";
import App from "./App";
import GeoCheck from "./components/GeoCheck";

console.log("React app is running");

createRoot(document.getElementById("root")!).render(
  <WebSocketProvider>
    <App />
    <GeoCheck />
  </WebSocketProvider>
);

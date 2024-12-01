import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
import { WebSocketProvider } from "./context/WebSocketContext";
import "./index.css";
import App from "./App";
console.log("React app is running");
createRoot(document.getElementById("root")).render(_jsx(WebSocketProvider, { children: _jsx(App, {}) }));

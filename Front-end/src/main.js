import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
import { WebSocketProvider } from "./context/WebSocketContext";
import "./index.css";
import App from "./App";
import GeoCheck from "./components/GeoCheck";
console.log("React app is running");
createRoot(document.getElementById("root")).render(_jsxs(WebSocketProvider, { children: [_jsx(App, {}), _jsx(GeoCheck, {})] }));

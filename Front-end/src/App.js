import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideNavigationBar from "./components/SideNavigationBar";
import PlayList from "./components/Playlist";
import AdminAuthentication from "./components/AdminAuthentication";
import SearchModal from "./components/SearchSong";
import QRCodeGenerator from "./components/admin/QRCodeGenerator";
import JukeBoxPlayer from "./components/JukeBoxPlayer";
// Import WebSocketProvider
import { WebSocketProvider } from "./context/WebSocketContext";
function App() {
    return (
    // Wrap the whole app with WebSocketProvider
    _jsxs(WebSocketProvider, { children: [_jsx("div", { children: _jsx("video", { className: "background-video", autoPlay: true, loop: true, muted: true, children: _jsx("source", { src: "/videos/Comp_1_43.mp4", type: "video/mp4" }) }) }), _jsx(Router, { children: _jsxs("div", { className: "App", children: [_jsx(SideNavigationBar, {}), _jsx(JukeBoxPlayer, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/admin-auth", element: _jsx(AdminAuthentication, {}) }), _jsx(Route, { path: "/search", element: _jsx(SearchModal, { isOpen: false, onClose: function () {
                                            throw new Error("Function not implemented.");
                                        } }) }), _jsx(Route, { path: "/playlist", element: _jsx(PlayList, { isOpen: false, onClose: function () {
                                            throw new Error("Function not implemented.");
                                        } }) }), _jsx(Route, { path: "/QrCode", element: _jsx(QRCodeGenerator, {}) })] })] }) })] }));
}
export default App;

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideNavigationBar from "./components/SideNavigationBar";
import PlayList from "./components/Playlist";
import AdminAuthentication from "./components/AdminAuthentication";
import SearchModal from "./components/SearchSong";
import QRCodeGenerator from "./components/admin/QRCodeGenerator";
import JukeBoxPlayer from "./components/JukeBoxPlayer";
import GeoCheck from "./components/GeoCheck";
import Coordinates from "./components/Coordinates";
// Import WebSocketProvider
import { WebSocketProvider } from "./context/WebSocketContext";
import { useLoginData } from "./hooks/useLoginData";
function App() {
    const { isLoggedIn } = useLoginData();
    return (
    // Wrap the whole app with WebSocketProvider
    _jsx(WebSocketProvider, { children: _jsx(Router, { children: _jsxs("div", { className: "App", children: [_jsx(SideNavigationBar, { loggedIn: isLoggedIn }), _jsx(JukeBoxPlayer, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/admin-auth", element: _jsx(AdminAuthentication, {}) }), _jsx(Route, { path: "/search", element: _jsx(SearchModal, { isOpen: false, onClose: function () {
                                        throw new Error("Function not implemented.");
                                    } }) }), _jsx(Route, { path: "/playlist", element: _jsx(PlayList, { isOpen: false, onClose: function () {
                                        throw new Error("Function not implemented.");
                                    } }) }), _jsx(Route, { path: "/QrCode", element: _jsx(QRCodeGenerator, {}) }), _jsx(Route, { path: "/coords", element: _jsx(Coordinates, {}) }), _jsx(Route, { path: "/geo-route", element: _jsx(GeoCheck, {}) })] })] }) }) }));
}
export default App;

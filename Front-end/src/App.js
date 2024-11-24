import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideNavigationBar from "./components/SideNavigationBar";
import PlayList from "./components/Playlist";
import Login from "./components/Login";
function App() {
    // const [count, setCount] = useState(0)
    return (_jsx(Router, { children: _jsxs("div", { className: "App", children: [_jsx(SideNavigationBar, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/playlist", element: _jsx(PlayList, { isOpen: false, onClose: function () {
                                    throw new Error("Function not implemented.");
                                } }) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) })] })] }) }));
}
export default App;

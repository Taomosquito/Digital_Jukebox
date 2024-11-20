import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideNavigationBar from './components/SideNavigationBar';
import Playlist from "./components/Playlist";
function App() {
    // const [count, setCount] = useState(0)
    return (_jsx(Router, { children: _jsxs("div", { className: 'App', children: [_jsx(SideNavigationBar, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(SideNavigationBar, {}) }), _jsx(Route, { path: "/playlist", element: _jsx(Playlist, {}) })] })] }) }));
}
export default App;

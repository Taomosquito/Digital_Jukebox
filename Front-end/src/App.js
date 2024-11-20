import { jsx as _jsx } from "react/jsx-runtime";
import './App.css';
import SideNavigationBar from './components/SideNavigationBar';
function App() {
    return (_jsx("div", { className: 'App', children: _jsx(SideNavigationBar, {}) }));
}
export default App;

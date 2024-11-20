import { jsx as _jsx } from "react/jsx-runtime";
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import SideNavigationBar from './components/SideNavigationBar';
function App() {
    // const [count, setCount] = useState(0)
    return (_jsx(Router, { children: _jsx("div", { className: 'App', children: _jsx(SideNavigationBar, {}) }) }));
}
export default App;

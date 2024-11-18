import { jsx as _jsx } from "react/jsx-runtime";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css';
import SideNavigationBar from './components/SideNavigationBar';
function App() {
    // const [count, setCount] = useState(0)
    return (_jsx("div", { className: 'App', children: _jsx(SideNavigationBar, {}) }));
}
export default App;

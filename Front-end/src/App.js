import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import ClientPlayer from "./components/ClientPlayer";
import SideNavigationBar from "./components/SideNavigationBar"
function App() {
    // const [count, setCount] = useState(0)
    return (_jsx(_Fragment, { children: _jsx(SideNavigationBar, {}) }));
}
export default App;

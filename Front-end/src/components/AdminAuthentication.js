import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import AddAdmin from "./AddAdmin";
import Login from "./Login";
const AdminAuthentication = () => {
    const [isAddingAdmin, setIsAddingAdmin] = useState(true);
    const toggleMode = () => setIsAddingAdmin((prev) => !prev);
    return (_jsxs("div", { children: [_jsxs("button", { onClick: toggleMode, children: ["Switch to ", isAddingAdmin ? "Login" : "Add Admin"] }), isAddingAdmin ? _jsx(AddAdmin, {}) : _jsx(Login, {})] }));
};
export default AdminAuthentication;

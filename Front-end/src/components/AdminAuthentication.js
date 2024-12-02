import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Login from "./Login";
import AddAdmin from "./AddAdmin";
import "../styles/admin/AdminAuthentication.scss";
const AdminAuthentication = () => {
    // Centralized state to manage authentication
    const [isToggled, setIsToggled] = useState(false);
    // Callback to handle login success
    const toggler = () => {
        setIsToggled((prev) => !prev);
    };
    return (_jsxs("div", { children: [_jsx("button", { onClick: toggler, children: "Creation / Login Toggle" }), isToggled ? _jsx(AddAdmin, {}) : _jsx(Login, {})] }));
};
export default AdminAuthentication;

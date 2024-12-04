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
    return (_jsx("div", { className: "admin-authentication__modal_overlay", children: _jsxs("div", { className: "admin-authentication__modal_content", children: [_jsx("button", { className: "admin-authentication__toggle", onClick: toggler, children: "Add new Admin user" }), isToggled ? _jsx(Login, {}) : _jsx(AddAdmin, {})] }) }));
};
export default AdminAuthentication;

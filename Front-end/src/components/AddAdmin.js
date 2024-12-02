import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoginData } from "../hooks/useLoginData";
import "../styles/admin/AddAdmin.scss";
import "../styles/admin/AdminAuthentication.scss";
function AddAdmin() {
    const { adminLoginUsername, adminLoginPassword, adminHandleUser, adminHandlePass, handleSubmit, } = useLoginData();
    console.log("Add Admin component is rendering");
    return (_jsxs("div", { className: "admin-authentication__modal-overlay", children: [_jsx("h2", { children: "Create Admin User" }), _jsx("div", { className: "admin-authentication__modal-content", children: _jsxs("form", { className: "login-form", onSubmit: handleSubmit, children: [_jsx("label", { htmlFor: "admin_username", children: "Create Username:" }), _jsx("input", { className: "admin_username", type: "text", placeholder: "Type here...", value: adminLoginUsername, onChange: adminHandleUser }), _jsx("label", { htmlFor: "admin_password", children: "Create Password:" }), _jsx("input", { className: "admin_password", type: "password", placeholder: "Type here...", value: adminLoginPassword, onChange: adminHandlePass }), _jsx("button", { type: "submit", className: "login-button", children: "Submit" })] }) })] }));
}
export default AddAdmin;

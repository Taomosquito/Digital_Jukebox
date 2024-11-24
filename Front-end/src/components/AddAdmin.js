import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoginData } from "../hooks/useLoginData";
function AddAdmin() {
    const { adminLoginUsername, adminLoginPassword, adminHandleUser, adminHandlePass, handleSubmit, } = useLoginData();
    console.log("Add Admin component is rendering");
    return (_jsx("div", { children: _jsxs("form", { className: "login-form", onSubmit: handleSubmit, children: [_jsx("label", { htmlFor: "admin_username", children: "Admin Username" }), _jsx("input", { className: "admin_username", type: "text", placeholder: "Type here...", value: adminLoginUsername, onChange: adminHandleUser }), _jsx("label", { htmlFor: "admin_password", children: "Admin Password" }), _jsx("input", { className: "admin_password", type: "password", placeholder: "Type here...", value: adminLoginPassword, onChange: adminHandlePass }), _jsx("button", { type: "submit", className: "login-button", children: "Add Admin" })] }) }));
}
export default AddAdmin;

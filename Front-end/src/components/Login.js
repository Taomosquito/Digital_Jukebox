import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLoginData } from "../hooks/useLoginData";
import "../styles/admin/Login.scss";
const Login = () => {
    const { adminLoginUsername, adminLoginPassword, adminHandleUser, adminHandlePass, error, message, handleLoginSubmit, } = useLoginData();
    return (_jsxs("div", { children: [_jsx("h2", { children: "Login" }), _jsxs("form", { onSubmit: handleLoginSubmit, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "username", children: "Username" }), _jsx("input", { id: "username", type: "text", value: adminLoginUsername, onChange: adminHandleUser, required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", type: "password", value: adminLoginPassword, onChange: adminHandlePass, required: true })] }), error && _jsx("p", { style: { color: "red" }, children: error }), message && _jsx("p", { style: { color: "green" }, children: message }), _jsx("button", { type: "submit", children: "Login" })] })] }));
};
export default Login;

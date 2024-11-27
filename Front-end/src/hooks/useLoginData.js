import { useState } from "react";
import axios from "axios";
export const useLoginData = () => {
    const [adminLoginUsername, setAdminLoginUsername] = useState("");
    const [adminLoginPassword, setAdminLoginPassword] = useState("");
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    // Handle input change for admin username
    const adminHandleUser = (event) => {
        setAdminLoginUsername(event.target.value);
    };
    // Handle input change for admin password
    const adminHandlePass = (event) => {
        setAdminLoginPassword(event.target.value);
    };
    // Handle form submission for login attempt
    const handleSubmit = (event) => {
        event.preventDefault();
        sendToAdminDatabase();
    };
    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        await sendToLoginRoute();
    };
    const sendToLoginRoute = async () => {
        try {
            setError(null); // Reset error state
            setMessage(null); // Reset message state
            const response = await axios.post("http://localhost:3000/login", { username: adminLoginUsername, password: adminLoginPassword }, { withCredentials: true });
            // await retrieveCookie();
            console.log(response);
            setMessage(response.data.message);
            setError(null);
        }
        catch (err) {
            setError(err.response?.data.message || "An error occurred during login");
            setMessage(null);
        }
    };
    const retrieveCookie = async () => {
        axios.defaults.withCredentials = true;
        axios
            .get("http://localhost:3000/profile")
            .then((response) => {
            console.log(response.data);
        })
            .catch((error) => {
            console.log(error);
        });
    };
    const sendToAdminDatabase = async () => {
        try {
            const response = await axios.post("http://localhost:3000/admins", { username: adminLoginUsername, password: adminLoginPassword }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error("Error adding admin:", error);
            throw new Error("Failed to add admin");
        }
    };
    return {
        adminLoginUsername,
        adminLoginPassword,
        adminHandleUser,
        adminHandlePass,
        handleSubmit,
        error,
        message,
        handleLoginSubmit,
    };
};

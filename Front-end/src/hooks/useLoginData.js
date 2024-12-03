import { useState } from "react";
import axios from "axios";
export const useLoginData = () => {
    const [adminLoginUsername, setAdminLoginUsername] = useState("");
    const [adminLoginPassword, setAdminLoginPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    const handleGeoSubmit = async (event) => {
        event.preventDefault();
        await sendToGeoRoute();
    };
    const sendToLoginRoute = async () => {
        try {
            setError(null); // Reset error state
            setMessage(null); // Reset message state
            const response = await axios.post("/back-end/login", { username: adminLoginUsername, password: adminLoginPassword }, { withCredentials: true });
            setIsLoggedIn(response.data.loggedIn);
            console.log(response.data.loggedIn);
            setMessage(response.data.message);
            setError(null);
        }
        catch (err) {
            setError(err.response?.data.message || "An error occurred during login");
            setMessage(null);
        }
    };
    const sendToLogoutRoute = async () => {
        try {
            setError(null); // Reset error state
            setMessage(null); // Reset message state
            const response = await axios.post("/back-end/login", { action: "logout" }, { withCredentials: true });
            console.log(response);
            setMessage(response.data.message);
            setError(null);
        }
        catch (err) {
            setError(err.response?.data.message || "An error occurred during login");
            setMessage(null);
        }
    };
    const sendToGeoRoute = async () => {
        try {
            setError(null);
            setMessage(null);
            // Get user's current geolocation
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                // Send geolocation data to the backend
                const response = await axios.post("/back-end/geo", {
                    latitude,
                    longitude,
                }, {
                    withCredentials: true, // Ensure cookies are sent
                });
                console.log(response);
                setMessage(response.data.message);
                setError(null);
            }, (error) => {
                setError("Unable to retrieve your location.");
                console.error("Geolocation error:", error);
            });
        }
        catch (err) {
            setError(err.response?.data.message ||
                "An error occurred during session creation.");
            setMessage(null);
        }
    };
    const sendToAdminDatabase = async () => {
        try {
            const response = await axios.post("/back-end/admins", { username: adminLoginUsername, password: adminLoginPassword }, {
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
        handleGeoSubmit,
        isLoggedIn,
    };
};

import { useState } from "react";
import axios from "axios";
export const useLoginData = () => {
    const [adminLoginUsername, setAdminLoginUsername] = useState("");
    const [adminLoginPassword, setAdminLoginPassword] = useState("");
    // Handle input change for admin username
    const adminHandleUser = (event) => {
        console.log("event", event);
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
    };
};

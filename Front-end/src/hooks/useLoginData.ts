import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useLoginData = () => {
  const [adminLoginUsername, setAdminLoginUsername] = useState<string>("");
  const [adminLoginPassword, setAdminLoginPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Handle input change for admin username
  const adminHandleUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdminLoginUsername(event.target.value);
  };
  // Handle input change for admin password
  const adminHandlePass = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdminLoginPassword(event.target.value);
  };
  // Handle form submission for login attempt
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendToAdminDatabase();
  };

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await sendToLoginRoute();
  };

  const sendToLoginRoute = async () => {
    try {
      setError(null); // Reset error state
      setMessage(null); // Reset message state

      const response = await axios.post(
        "http://localhost:3000/login",
        { username: adminLoginUsername, password: adminLoginPassword },
        { withCredentials: true }
      );

      // await retrieveCookie();
      console.log(response);
      setMessage(response.data.message);
      setError(null);
    } catch (err: any) {
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
      const response = await axios.post<any>(
        "http://localhost:3000/admins",
        { username: adminLoginUsername, password: adminLoginPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error: any) {
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

import React from "react";
import { useLoginData } from "../hooks/useLoginData";

const Login: React.FC = () => {
  const {
    adminLoginUsername,
    adminLoginPassword,
    adminHandleUser,
    adminHandlePass,
    error,
    message,
    handleLoginSubmit,
  } = useLoginData();

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={adminLoginUsername}
            onChange={adminHandleUser}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={adminLoginPassword}
            onChange={adminHandlePass}
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

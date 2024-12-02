import React from "react";
import { useLoginData } from "../hooks/useLoginData";
import "../styles/admin/Login.scss"

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
    <div className="admin-authentication__modal-overlay">
      <h3>Login</h3>
      <div className="admin-authentication__modal-content">
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <div>
            <label htmlFor="username">Username: </label><br />
            <input
              id="username"
              type="text"
              value={adminLoginUsername}
              onChange={adminHandleUser}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password: </label><br />
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
      
    </div>
  );
};

export default Login;

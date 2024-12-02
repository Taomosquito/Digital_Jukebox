import { useLoginData } from "../hooks/useLoginData";
import "../styles/admin/AddAdmin.scss"
import "../styles/admin/AdminAuthentication.scss"

function AddAdmin() {
  const {
    adminLoginUsername,
    adminLoginPassword,
    adminHandleUser,
    adminHandlePass,
    handleSubmit,
  } = useLoginData();
  
  console.log("Add Admin component is rendering");

  return (
    <div className="admin-authentication__modal-overlay">
      <h3>Create Admin User</h3>
      <div className="admin-authentication__modal-content">
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="admin_username">Create Username:</label>
          <input
            className="admin_username"
            type="text"
            placeholder="Type here..."
            value={adminLoginUsername}
            onChange={adminHandleUser}
          />
          <label htmlFor="admin_password">Create Password:</label>
          <input
            className="admin_password"
            type="password"
            placeholder="Type here..."
            value={adminLoginPassword}
            onChange={adminHandlePass}
          />
          <button type="submit" className="login-button">
            Submit
          </button>
        </form>
      </div>
      
    </div>
  );
}

export default AddAdmin;

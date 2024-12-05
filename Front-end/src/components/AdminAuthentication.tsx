import React, { useState } from "react";
import Login from "./Login";
import AddAdmin from "./AddAdmin";
import "../styles/admin/AdminAuthentication.scss"

const AdminAuthentication: React.FC = () => {
  // Centralized state to manage authentication
  const [isToggled, setIsToggled] = useState(false);

  // Callback to handle login success
  const toggler = () => {
    setIsToggled((prev) => !prev);
  };

  return (
    <div className="admin-authentication__modal_overlay">
      <div className="admin-authentication__modal_content">
        <button className="admin-authentication__toggle" onClick={toggler}>Add new Admin user</button>
        {isToggled ? <Login /> : <AddAdmin />}
      </div>
    </div>
  );
};
export default AdminAuthentication;

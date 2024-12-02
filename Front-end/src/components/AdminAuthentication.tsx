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
    <div>
      <button onClick={toggler}>Creation / Login Toggle</button>
      {isToggled ? <AddAdmin /> : <Login />}
    </div>
  );
};
export default AdminAuthentication;

import React, { useState } from "react";
import AddAdmin from "./AddAdmin";
import Login from "./Login";

const AdminAuthentication = () => {
  const [isAddingAdmin, setIsAddingAdmin] = useState(true);
  const toggleMode = () => setIsAddingAdmin((prev) => !prev);
  return (
    <div>
      <button onClick={toggleMode}>
        Switch to {isAddingAdmin ? "Login" : "Add Admin"}
      </button>
      {isAddingAdmin ? <AddAdmin /> : <Login />}
    </div>
  );
};

export default AdminAuthentication;

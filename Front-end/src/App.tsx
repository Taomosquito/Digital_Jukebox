import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TrackListManager from "./components/TrackListManager";
import SideNavigationBar from "./components/SideNavigationBar";
import SearchSong from "./components/SearchSong";
import PlayList from "./components/Playlist";
import AddAdmin from "./components/AddAdmin";
import Login from "./components/Login";
import AdminAuthentication from "./components/AdminAuthentication";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="App">
        <SideNavigationBar />
        <Routes>
          <Route
            path="/playlist"
            element={
              <PlayList
                isOpen={false}
                onClose={function (): void {
                  throw new Error("Function not implemented.");
                }}
              />
            }
          />
          <Route path="/admin-auth" element={<AdminAuthentication />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

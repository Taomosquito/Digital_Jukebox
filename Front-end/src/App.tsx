import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TrackListManager from "./components/TrackListManager";
import SideNavigationBar from "./components/SideNavigationBar";
import SearchSong from "./components/SearchSong";
import PlayList from "./components/Playlist";
import AdminAuthentication from "./components/AdminAuthentication";
import SearchModal from "./components/SearchSong";
import QRCodeGenerator from "./components/admin/QRCodeGenerator";

// Import WebSocketProvider
import { WebSocketProvider } from "./context/WebSocketContext";
import GeoCheck from "./components/GeoCheck";

function App() {
  return (
    // Wrap the whole app with WebSocketProvider
    <WebSocketProvider>
      <Router>
        <div className="App">
          <SideNavigationBar />
          <Routes>
            <Route path="/admin-auth" element={<AdminAuthentication />} />
            <Route
              path="/search"
              element={
                <SearchModal
                  isOpen={false}
                  onClose={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              }
            />
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
            <Route path="/QrCode" element={<QRCodeGenerator />} />
          </Routes>
        </div>
      </Router>
    </WebSocketProvider>
  );
}

export default App;

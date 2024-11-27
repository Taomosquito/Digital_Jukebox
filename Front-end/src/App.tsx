import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TrackListManager from "./components/TrackListManager";
import SideNavigationBar from "./components/SideNavigationBar";
import SearchSong from "./components/SearchSong";
import PlayList from "./components/Playlist";
import AddAdmin from "./components/AddAdmin";
import Login from "./components/Login";
import SearchModal from "./components/SearchSong";
import JukeBoxPlayer from "./components/client/JukeBoxPlayer";

// Import WebSocketProvider
import { WebSocketProvider } from './context/WebSocketContext';

function App() {
  
  return (
    // Wrap the whole app with WebSocketProvider
    <WebSocketProvider>
      <Router>
        <div className="App">
          <SideNavigationBar />
          <JukeBoxPlayer />
          <Routes>
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
          </Routes>
        </div>
      </Router>
    </WebSocketProvider>
  );
}

export default App;

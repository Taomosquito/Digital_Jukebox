import React, { useState } from "react";
import './App.css'
import TrackListManager from "./components/TrackListManager";
import SideNavigationBar from './components/SideNavigationBar'
import SearchSong from './components/SearchSong'
import Playlist from "./components/Playlist";


function App() {
   return (
    <div className='App'>
      <SideNavigationBar />
    </div>
  )
}

export default App;

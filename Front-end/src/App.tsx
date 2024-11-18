import React, { useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import TrackListManager from "./components/TrackListManager";
import SideNavigationBar from './components/SideNavigationBar'
import SearchSong from './components/SearchSong'


function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <SideNavigationBar />
    </div>
  )
}

export default App;

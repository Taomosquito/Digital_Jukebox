import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SideNavigationBar from "./components/SideNavigationBar";
import PlayList from "./components/Playlist";
import AdminAuthentication from "./components/AdminAuthentication";
import SearchModal from "./components/SearchSong";
import QRCodeGenerator from "./components/admin/QRCodeGenerator";
import JukeBoxPlayer from "./components/JukeBoxPlayer";
import GeoCheck from "./components/GeoCheck";
import Coordinates from "./components/Coordinates";

// Import WebSocketProvider
import { WebSocketProvider } from "./context/WebSocketContext";
import { useLoginData } from "./hooks/useLoginData";

function App() {
  const { isLoggedIn } = useLoginData();
  return (
    // Wrap the whole app with WebSocketProvider
    <WebSocketProvider>
      <Router>
        <div className="App">
          <SideNavigationBar loggedIn={isLoggedIn} />
          <JukeBoxPlayer />
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
            <Route path="/coords" element={<Coordinates />} />
            <Route path="/geo-route" element={<GeoCheck />} />
          </Routes>
        </div>
      </Router>
    </WebSocketProvider>
  );
}
export default App;

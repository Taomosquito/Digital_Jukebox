import "../styles/SideNavigation.scss";
import { useApplication } from "../hooks/useApplicationData";
import { useNavigate, useLocation } from "react-router-dom";

const NavBarAdmin = () => {
  const {
    handleSearchClick,
    handlePlaylistClick,
    handleDeleteAllSongs,
    handleHomeClick,
    handleCloseModal,
    handleCloseSideNav,
  } = useApplication();

  const navigate = useNavigate();

  //Handle home page, close other modals and sideNavigationBar
  const handleHomeNavigation = () => {
    handleCloseModal(); // Close any open modal
    handleHomeClick(); //Open the Home Page
    handleCloseSideNav(); //Close the side navigation
    navigate("/"); // Navigate to Home route
  };

  const handlePlaylistNavigation = () => {
    handleCloseModal();
    handlePlaylistClick(); // Open the Playlist Modal
    handleCloseSideNav();
    navigate("/playlist"); // Navigate to playlist route
  };

  const handleSearchNavigation = () => {
    handleSearchClick(); // Open the Search Modal
    handleCloseSideNav();
    navigate("/search");
  };

  const handleDeleteAllSongsNavigation = () => {
    handleCloseModal();
    handleDeleteAllSongs();
    navigate("/");
  };

  const handleLoginOrAddAdmin = () => {
    handleHomeClick(); //Close Playlist and Search
    handleCloseSideNav(); //Close SideNavBar
    navigate("/admin-auth");
  };
  const handleCoordinates = () => {
    handleCloseSideNav();
    navigate("/coords");
  };
  const handleGeoLocation = () => {
    navigate("/geo-route");
  };

  return (
    <>
      <div>
        <div className="side-nav-bar__admin-control">
          {/* Admin control icons */}
          <i className="fas fa-house" onClick={handleHomeNavigation}></i>
          <i className="fas fa-user-plus" onClick={handleLoginOrAddAdmin}></i>
          <i
            className="fas fa-magnifying-glass"
            onClick={handleSearchNavigation}
          ></i>
          <i className="fas fa-mobile-alt" onClick={handleGeoLocation}></i>
          <i className="fas fa-location-arrow" onClick={handleCoordinates}></i>
          <i
            className="fas fa-heart-circle-xmark"
            onClick={handleDeleteAllSongsNavigation}
            title="Delete All Songs"
          ></i>
          <i className="fas fa-music" onClick={handlePlaylistNavigation}></i>
        </div>
        <br />

        {/* Logout */}
        <span className="side-nav-bar__logout">
          <i className="fas fa-arrow-right-from-bracket fa-rotate-180"></i>
        </span>
      </div>
    </>
  );
};

export default NavBarAdmin;

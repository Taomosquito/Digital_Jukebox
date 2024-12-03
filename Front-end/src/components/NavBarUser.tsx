import "../styles/SideNavigation.scss";
import { useEffect, useState } from "react";
import SearchModal from "./SearchSong";
import { useApplication } from "../hooks/useApplicationData";
import { useNavigate, useLocation } from "react-router-dom";
import { useLoginData } from "../hooks/useLoginData";

const NavBarUser = () => {
  const {
    handleSearchClick,
    handlePlaylistClick,
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

  const handleGeoLocation = () => {
    navigate("/geo-route");
  };

  const handleLoginOrAddAdmin = () => {
    handleHomeClick(); //Close Playlist and Search
    handleCloseSideNav(); //Close SideNavBar
    navigate("/admin-auth");
  };

  return (
    <>
      <div>
        {/* Home */}
        <i className="fas fa-house" onClick={handleHomeNavigation}></i>
        {/* Search */}
        <i
          className="fas fa-magnifying-glass"
          onClick={handleSearchNavigation}
        ></i>
        <i className="fas fa-music" onClick={handlePlaylistNavigation}></i>
        {/* Login */}
        <i className="fas fa-mobile-alt" onClick={handleLoginOrAddAdmin}></i>
        <span className="side-nav-bar__logout">
          <i className="fas fa-arrow-right-from-bracket fa-rotate-180"></i>
        </span>
      </div>
    </>
  );
};

export default NavBarUser;

import { useState, useEffect } from "react";
import "../styles/SideNavigation.scss";
import SearchModal from "./SearchSong";
import { useApplication } from "../hooks/useApplicationData";
import { useNavigate, useLocation } from "react-router-dom";
import AdminAuthentication from "./AdminAuthentication";

const SideNavigation = () => {
  const {
    isMenuActive,
    isModalOpen,
    isPlaylistOpen,
    handleToggleMenu,
    handleSearchClick,
    handlePlaylistClick,
    handleDeleteAllSongs,
    handleHomeClick,
    handleCloseModal,
    handleCloseSideNav,
  } = useApplication();

  const navigate = useNavigate();
  const location = useLocation();

  // TODO - THIS USEEFFECT IS CALLING AN INFINITE LOOP VERIFY IT

  // Open the modal when the route is /search
  // useEffect(() => {
  //   if (location.pathname === "/search") {
  //     handleSearchClick(); // Open the modal when /search is visited
  //   } else {
  //     handleCloseModal(); // Close the modal if we are not on /search
  //   }
  // }, [location.pathname, handleSearchClick, handleCloseModal]);

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
    navigate("/admin-auth");
  };

  return (
    <>
      {/* Clickable Logo that toggles the side navigation */}
      <div className="side-nav-bar__logo" onClick={handleToggleMenu}>
        <i className="fas fa-sliders"></i>
      </div>

      {/* Mobile search toggle link */}
      <div className="side-nav-bar__search-link">
        <i
          className="fas fa-magnifying-glass"
          onClick={handleSearchNavigation}
        ></i>
      </div>

      {/* Side Navigation - this will show/hide based on isMenuActive */}
      <div className={`side-nav-bar ${isMenuActive ? "active" : "hidden"}`}>
        <div className="side-nav-bar__icon">
          {/* Admin control icons */}
          <div className="side-nav-bar__admin-control">
            <i className="fas fa-house" onClick={handleHomeNavigation}></i>
            <i className="fas fa-user-plus" onClick={handleLoginOrAddAdmin}></i>
            <i
              className="fas fa-magnifying-glass"
              onClick={handleSearchNavigation}
            ></i>
            <i
              className="fas fa-heart-circle-xmark"
              onClick={handleDeleteAllSongsNavigation}
              title="Delete All Songs"
            ></i>
            <i className="fas fa-music" onClick={handlePlaylistNavigation}></i>
          </div>

          <br />

          {/* Media control icons */}
          <div className="side-nav-bar__media-control">
            <i className="fas fa-circle-pause"></i>
            <i className="fas fa-forward-step"></i>
          </div>

          {/* Logout */}
          <span className="side-nav-bar__logout">
            <i className="fas fa-arrow-right-from-bracket"></i>
          </span>
        </div>
      </div>

      {/* Search Modal */}
      {/* <SearchModal isOpen={isModalOpen} onClose={() => handleCloseModal(() => {})} /> */}
      <SearchModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default SideNavigation;

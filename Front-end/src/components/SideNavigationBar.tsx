import { useState, useEffect } from "react";
import "../styles/SideNavigation.scss";
import SearchModal from "./SearchSong";
import { useApplication } from "../hooks/useApplicationData";
import { useNavigate, useLocation } from "react-router-dom";

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
  const handleCoordinates = () => {
    navigate("/coords");
  };
  const currentUser = true; //TODO: removed when session is implemented

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
          {/* TODO: declared currentUser variable (above) to be removed, once session is implemented  */}

          {!currentUser ? (
            /* Admin control icons */
            <div>
              {/* Home */}
              <i className="fas fa-house" onClick={handleHomeNavigation}></i>
              {/* Search */}
              <i
                className="fas fa-magnifying-glass"
                onClick={handleSearchNavigation}
              ></i>
              {/* Login */}
              <span className="side-nav-bar__login">
                <i
                  className="fas fa-arrow-right-from-bracket"
                  onClick={handleLoginOrAddAdmin}
                >
                  {/* TODO: Modify the onclick accordingly */}
                </i>
              </span>
            </div>
          ) : (
            <div>
              <div className="side-nav-bar__admin-control">
                {/* Admin control icons */}
                <i className="fas fa-house" onClick={handleHomeNavigation}></i>
                <i
                  className="fas fa-user-plus"
                  onClick={handleLoginOrAddAdmin}
                ></i>
                <i
                  className="fas fa-magnifying-glass"
                  onClick={handleSearchNavigation}
                ></i>
                <i
                  className="as fa-location-arrow"
                  onClick={handleCoordinates}
                ></i>
                <i
                  className="fas fa-heart-circle-xmark"
                  onClick={handleDeleteAllSongsNavigation}
                  title="Delete All Songs"
                ></i>
                <i
                  className="fas fa-music"
                  onClick={handlePlaylistNavigation}
                ></i>
              </div>
              <br />

              {/* Media control icons */}
              <div className="side-nav-bar__media-control">
                <i className="fas fa-circle-pause"></i>
                <i className="fas fa-forward-step"></i>
              </div>

              {/* Logout */}
              <span className="side-nav-bar__logout">
                <i className="fas fa-arrow-right-from-bracket fa-rotate-180"></i>
              </span>
            </div>
          )}
        </div>
      </div>

      <SearchModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default SideNavigation;

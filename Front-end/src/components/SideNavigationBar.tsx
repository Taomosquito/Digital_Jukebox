import React from 'react';
import '../styles/SideNavigation.scss';
import SearchModal from './SearchSong';
import { useApplication } from '../hooks/useApplicationData';
import { Link, useNavigate } from 'react-router-dom';

const SideNavigation = () => {
  const {
    isMenuActive,
    isModalOpen,
    isPlaylistOpen, //
    handleToggleMenu,
    handleSearchClick,
    handlePlaylistClick,//
    handleCloseModal,
    handleCloseSideNav
  } = useApplication(); // Use the custom hook for state and functions

  const navigate = useNavigate();

  const handlePlaylistNavigation = () => {
    handleCloseModal();  // Close any open modal
    handlePlaylistClick();  // Open the Playlist Modal
    handleCloseSideNav();  // Close the side navigation
    navigate('/playlist');  // Navigate to playlist route
  };

  // Function to handle search modal click and close any other modals
  const handleSearchNavigation = () => {
    handleCloseModal();
    handleSearchClick();  // Open the Search Modal
    handleCloseSideNav();  // Close the side navigation
    navigate('/search');  // Navigate to the search route
  };

  return (
    <>
      {/* Clickable Logo that toggles the side navigation */}
      <div className="side-nav-bar__logo" onClick={handleToggleMenu}>
        <i className="fas fa-sliders"></i>
      </div>

      {/* Mobile search toggle link */}
      <div
        className="side-nav-bar__search-link"
        onClick={handleSearchNavigation} //
        // onClick={() => {
        //   handleSearchClick(); // Open the search modal
        //   handleCloseSideNav(); // and close the side navigation
        // }}
      >
        <i className="fas fa-magnifying-glass"></i>
      </div>

      {/* Side Navigation - this will show/hide based on isMenuActive */}
      <div className={`side-nav-bar ${isMenuActive ? 'active' : 'hidden'}`}>
        <div className="side-nav-bar__icon">
          {/* Admin control icons */}
          <div className="side-nav-bar__admin-control">
            <Link to="/">
              <i className="fas fa-house"></i>
            </Link>
            
            <i className="fas fa-user-plus"></i>
            <i
              className="fas fa-magnifying-glass"
              onClick={handleSearchNavigation} //
              // onClick={() => {
              //   handleSearchClick();
              //   handleCloseSideNav(); // Close the menu when the search is triggered
              // }}
            ></i>
            <i className="fas fa-heart-circle-xmark"></i>
            <i className="fas fa-music"
              onClick={handlePlaylistNavigation}></i> {/*//  */}

            {/* <Link to="/playlist">
              <i className="fas fa-music"></i>
            </Link> */}

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

import React from 'react';
import '../styles/SideNavigation.scss';
import SearchModal from './SearchSong';
import { useApplication } from '../hooks/useApplicationData';
import { Link } from 'react-router-dom';

const SideNavigation = () => {
  const {
    isMenuActive,
    isModalOpen,
    handleToggleMenu,
    handleSearchClick,
    handleCloseModal,
    handleCloseSideNav
  } = useApplication(); // Use the custom hook for state and functions

  return (
    <>
      {/* Clickable Logo that toggles the side navigation */}
      <div className="side-nav-bar__logo" onClick={handleToggleMenu}>
        <i className="fas fa-sliders"></i>
      </div>

      {/* Mobile search toggle link */}
      <div
        className="side-nav-bar__search-link"
        onClick={() => {
          handleSearchClick(); // Open the search modal
          handleCloseSideNav(); // and close the side navigation
        }}
      >
        <i className="fas fa-magnifying-glass"></i>
      </div>

      {/* Side Navigation - this will show/hide based on isMenuActive */}
      <div className={`side-nav-bar ${isMenuActive ? 'active' : 'hidden'}`}>
        <div className="side-nav-bar__icon">
          {/* Admin control icons */}
          <div className="side-nav-bar__admin-control">
            <i className="fas fa-house"></i>
            <i className="fas fa-user-plus"></i>
            <i
              className="fas fa-magnifying-glass"
              onClick={() => {
                handleSearchClick();
                handleCloseSideNav(); // Close the menu when the search is triggered
              }}
            ></i>
            <i className="fas fa-heart-circle-xmark"></i>
            <Link to="/playlist">
              <i className="fas fa-music"></i>
            </Link>

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
      <SearchModal isOpen={isModalOpen} onClose={() => handleCloseModal(() => {})} />
    </>
  );
};

export default SideNavigation;

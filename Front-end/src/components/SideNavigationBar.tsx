import React, { useState } from 'react';
import '../styles/SideNavigation.scss';
import SearchModal from './SearchSong';  // Import the SearchModal

const SideNavigation = () => {
  const [isMenuActive, setIsMenuActive] = useState(false); // Controls the visibility of the side nav
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggles the menu visibility
  const handleToggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  // Opens the search modal
  const handleSearchClick = () => {
    setIsModalOpen(true);
  };

  // Closes the search modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Clickable Logo that toggles the side navigation */}
      <div className="side-nav-bar__logo" onClick={handleToggleMenu}>
        <i className="fas fa-sliders"></i>
      </div>

      {/* Mobile search toggle link */}
      <div className="side-nav-bar__search-link"
        onClick={() => {
                handleSearchClick();
                handleToggleMenu();
              }}>
        <i className="fas fa-magnifying-glass"></i>
      </div>

      {/* Side Navigation - this will show/hide based on isMenuActive */}
      <div className={`side-nav-bar ${isMenuActive ? 'active' : 'hidden'}`}>
        <div className="side-nav-bar__icon">
          {/* Admin control icons */}
          <div className="side-nav-bar__admin-control">
            <i className="fas fa-house"></i>
            <i className="fas fa-user-plus"></i>
            <i className="fas fa-magnifying-glass"
              onClick={() => {
                handleSearchClick();
                handleToggleMenu();
              }}
            ></i>
            <i className="fas fa-heart-circle-xmark"></i>
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
      <SearchModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default SideNavigation;

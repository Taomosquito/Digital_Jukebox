
import React, { useState } from 'react';
import '../styles/SideNavigation.scss';

const SideNavigation = () => {
  const [isMenuActive, setIsMenuActive] = useState(false);

  const handleSearchClick = () => {
    setIsMenuActive((prevState) => !prevState);
  };

  return (
    <>
    {/* Mobile search toggle link */}
    <div className="side-nav-bar__search-link" onClick={handleSearchClick}>
      <i className="fas fa-magnifying-glass"></i>
    </div>

    {/* Logo and Icons (visible when the menu is active or on larger screens) */}
    <div className="side-nav-bar">
      <span className="side-nav-bar__logo">
        <i className="fas fa-champagne-glasses"></i>
      </span>

      <div className={`side-nav-bar__icon ${isMenuActive ? 'active' : ''}`}>
        {/* Admin control icons */}
        <div className="side-nav-bar__admin-control">
          <i className="fas fa-house"></i>
          <i className="fas fa-user-plus"></i>
          <i className="fas fa-magnifying-glass"></i>
          <i className="fas fa-heart-circle-xmark"></i>
        </div>
        <br></br>

        {/* Media control icons */}
        <div className="side-nav-bar__media-control">
          <i className="fas fa-circle-pause"></i>
          <i className="fas fa-forward-step"></i>
        </div>

        {/* Logout */}
        <span className="side-nav-bar__logout">
          <i className="fas fa-arrow-right-from-bracket"></i>
        </span>

        {/* Login (commented out, but can be re-enabled if necessary) */}
        {/* <div className="side-nav-bar__login">
          <i className="fas fa-arrow-right-to-bracket fa-rotate-180"></i>
        </div> */}
      </div>
    </div>
    </>
  );
};

export default SideNavigation;

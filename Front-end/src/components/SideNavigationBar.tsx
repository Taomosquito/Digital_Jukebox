import React from "react";
import "../styles/SideNavigation.scss";
import SearchModal from "./SearchSong";
import { useApplication } from "../hooks/useApplicationData";

const SideNavigation = () => {
  const {
    isMenuActive,
    isModalOpen,
    handleToggleMenu,
    handleSearchClick,
    handleCloseModal,
    handleCloseSideNav,
  } = useApplication(); // Use the custom hook for state and functions

  return (
    <>
      {/* Clickable Logo that toggles the side navigation */}
      <div
        className="side-nav-bar__logo"
        data-testid="nav-button"
        onClick={handleToggleMenu}
      >
        <i className="fas fa-sliders"></i>
      </div>

      {/* Mobile search toggle link */}
      <div
        data-testid="search-button"
        className="side-nav-bar__search-link"
        onClick={() => {
          handleSearchClick(); // Open the search modal
          handleCloseSideNav(); // and close the side navigation
        }}
      >
        <i className="fas fa-magnifying-glass"></i>
      </div>

      {/* Side Navigation - this will show/hide based on isMenuActive */}
      <div
        className={`side-nav-bar ${isMenuActive ? "active" : "hidden"}`}
        data-testid="user-button-parent"
      >
        <div className="side-nav-bar__icon">
          {/* Admin control icons */}
          <div
            className="side-nav-bar__admin-control"
            data-testid="user-button"
          >
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
      <SearchModal
        isOpen={isModalOpen}
        onClose={() => handleCloseModal(() => {})}
      />
    </>
  );
};

export default SideNavigation;

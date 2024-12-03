import "../styles/SideNavigation.scss";
import { useEffect, useState } from "react";
import SearchModal from "./SearchSong";
import { useApplication } from "../hooks/useApplicationData";
import { useNavigate } from "react-router-dom";
import { useLoginData } from "../hooks/useLoginData";
import NavBarUser from "./NavBarUser";
import NavBarAdmin from "./NavBarAdmin";

type SideNavigationProps = {
  loggedIn: boolean; // expects a boolean
};

const SideNavigation: React.FC<SideNavigationProps> = ({ loggedIn }) => {
  const {
    isMenuActive,
    isModalOpen,
    handleToggleMenu,
    handleSearchClick,
    handleCloseModal,
    handleCloseSideNav,
  } = useApplication();

  const { isLoggedIn } = useLoginData();

  const [currentState, setCurrentState] = useState(false);

  // useEffect to react to changes in props or state
  useEffect(() => {
    if (isLoggedIn) {
      setCurrentState(true); // Trigger some state update on login
    } else {
      setCurrentState(false); // Handle logout
    }
  }, [isLoggedIn]);

  const navigate = useNavigate();

  const handleSearchNavigation = () => {
    handleSearchClick(); // Open the Search Modal
    handleCloseSideNav();
    navigate("/search");
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
          {/* TODO: declared currentUser variable (above) to be removed, once session is implemented  */}

          {currentState ? <NavBarUser /> : <NavBarAdmin />}
        </div>
      </div>

      <SearchModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default SideNavigation;

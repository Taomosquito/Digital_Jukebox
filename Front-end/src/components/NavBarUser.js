import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import "../styles/SideNavigation.scss";
import { useApplication } from "../hooks/useApplicationData";
import { useNavigate } from "react-router-dom";
const NavBarUser = () => {
    const { handleSearchClick, handlePlaylistClick, handleHomeClick, handleCloseModal, handleCloseSideNav, } = useApplication();
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
    return (_jsx(_Fragment, { children: _jsxs("div", { children: [_jsx("i", { className: "fas fa-house", onClick: handleHomeNavigation }), _jsx("i", { className: "fas fa-magnifying-glass", onClick: handleSearchNavigation }), _jsx("i", { className: "fas fa-music", onClick: handlePlaylistNavigation }), _jsx("i", { className: "fas fa-mobile-alt", onClick: handleLoginOrAddAdmin }), _jsx("span", { className: "side-nav-bar__logout", children: _jsx("i", { className: "fas fa-arrow-right-from-bracket fa-rotate-180" }) })] }) }));
};
export default NavBarUser;

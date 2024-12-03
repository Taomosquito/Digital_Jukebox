import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import "../styles/SideNavigation.scss";
import { useApplication } from "../hooks/useApplicationData";
import { useNavigate } from "react-router-dom";
const NavBarAdmin = () => {
    const { handleSearchClick, handlePlaylistClick, handleDeleteAllSongs, handleHomeClick, handleCloseModal, handleCloseSideNav, } = useApplication();
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
    const handleDeleteAllSongsNavigation = () => {
        handleCloseModal();
        handleDeleteAllSongs();
        navigate("/");
    };
    const handleLoginOrAddAdmin = () => {
        handleHomeClick(); //Close Playlist and Search
        handleCloseSideNav(); //Close SideNavBar
        navigate("/admin-auth");
    };
    const handleCoordinates = () => {
        handleCloseSideNav();
        navigate("/coords");
    };
    const handleGeoLocation = () => {
        navigate("/geo-route");
    };
    return (_jsx(_Fragment, { children: _jsxs("div", { children: [_jsxs("div", { className: "side-nav-bar__admin-control", children: [_jsx("i", { className: "fas fa-house", onClick: handleHomeNavigation }), _jsx("i", { className: "fas fa-user-plus", onClick: handleLoginOrAddAdmin }), _jsx("i", { className: "fas fa-magnifying-glass", onClick: handleSearchNavigation }), _jsx("i", { className: "fas fa-mobile-alt", onClick: handleGeoLocation }), _jsx("i", { className: "fas fa-location-arrow", onClick: handleCoordinates }), _jsx("i", { className: "fas fa-heart-circle-xmark", onClick: handleDeleteAllSongsNavigation, title: "Delete All Songs" }), _jsx("i", { className: "fas fa-music", onClick: handlePlaylistNavigation })] }), _jsx("br", {}), _jsx("span", { className: "side-nav-bar__logout", children: _jsx("i", { className: "fas fa-arrow-right-from-bracket fa-rotate-180" }) })] }) }));
};
export default NavBarAdmin;

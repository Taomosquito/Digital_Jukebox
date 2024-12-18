import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import "../styles/SideNavigation.scss";
import SearchModal from "./SearchSong";
import { useApplication } from "../hooks/useApplicationData";
import { useNavigate, useLocation } from "react-router-dom";
const SideNavigation = () => {
    const { isMenuActive, isModalOpen, isPlaylistOpen, handleToggleMenu, handleSearchClick, handlePlaylistClick, handleDeleteAllSongs, handleHomeClick, handleCloseModal, handleCloseSideNav, } = useApplication();
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
    const handleQRCodeClick = () => {
        navigate('/QrCode');
    };
    const currentUser = true; //TODO: removed when session is implemented
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "side-nav-bar__logo", onClick: handleToggleMenu, children: _jsx("i", { className: "fas fa-sliders" }) }), _jsx("div", { className: "side-nav-bar__search-link", children: _jsx("i", { className: "fas fa-magnifying-glass", onClick: handleSearchNavigation }) }), _jsx("div", { className: `side-nav-bar ${isMenuActive ? "active" : "hidden"}`, children: _jsx("div", { className: "side-nav-bar__icon", children: !currentUser ? (
                    /* Admin control icons */
                    _jsxs("div", { children: [_jsx("i", { className: "fas fa-house", onClick: handleHomeNavigation }), _jsx("span", { className: "side-nav-bar__login", children: _jsx("i", { className: "fas fa-arrow-right-from-bracket", onClick: handleLoginOrAddAdmin }) })] })) : (_jsxs("div", { children: [_jsxs("div", { className: "side-nav-bar__admin-control", children: [_jsx("i", { className: "fas fa-house", onClick: handleHomeNavigation }), _jsx("i", { className: "fas fa-user-plus", onClick: handleLoginOrAddAdmin }), _jsx("i", { className: "fa-solid fa-qrcode", onClick: handleQRCodeClick }), _jsx("i", { className: "fas fa-location-arrow", onClick: handleCoordinates }), _jsx("i", { className: "fas fa-magnifying-glass", onClick: handleSearchNavigation }), _jsx("i", { className: "fas fa-music", onClick: handlePlaylistNavigation }), _jsx("i", { className: "fas fa-heart-circle-xmark", onClick: handleDeleteAllSongsNavigation, title: "Delete All Songs" })] }), _jsx("br", {}), _jsxs("div", { className: "side-nav-bar__media-control", children: [_jsx("i", { className: "fas fa-circle-pause" }), _jsx("i", { className: "fas fa-forward-step" })] }), _jsx("span", { className: "side-nav-bar__logout", children: _jsx("i", { className: "fas fa-arrow-right-from-bracket fa-rotate-180" }) })] })) }) }), _jsx(SearchModal, { isOpen: isModalOpen, onClose: handleCloseModal })] }));
};
export default SideNavigation;

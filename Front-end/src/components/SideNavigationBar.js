import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from 'react';
import '../styles/SideNavigation.scss';
import SearchModal from './SearchSong';
import { useApplication } from '../hooks/useApplicationData';
import { useNavigate, useLocation } from 'react-router-dom';
const SideNavigation = () => {
    const { isMenuActive, isModalOpen, isPlaylistOpen, handleToggleMenu, handleSearchClick, handlePlaylistClick, handleHomeClick, handleCloseModal, handleCloseSideNav } = useApplication();
    const navigate = useNavigate();
    const location = useLocation();
    // Open the modal when the route is /search
    useEffect(() => {
        if (location.pathname === '/search') {
            handleSearchClick(); // Open the modal when /search is visited
        }
        else {
            handleCloseModal(); // Close the modal if we are not on /search
        }
    }, [location.pathname, handleSearchClick, handleCloseModal]);
    //Handle home page, close other modals and sideNavigationBar
    const handleHomeNavigation = () => {
        handleCloseModal(); // Close any open modal
        handleHomeClick(); //Open the Home Page
        handleCloseSideNav(); //Close the side navigation
        navigate('/'); // Navigate to Home route
    };
    const handlePlaylistNavigation = () => {
        handleCloseModal();
        handlePlaylistClick(); // Open the Playlist Modal
        handleCloseSideNav();
        navigate('/playlist'); // Navigate to playlist route
    };
    const handleSearchNavigation = () => {
        // handleCloseModal(); //Testing, causes issue to click twice
        handleSearchClick(); // Open the Search Modal
        handleCloseSideNav();
        navigate('/search');
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "side-nav-bar__logo", onClick: handleToggleMenu, children: _jsx("i", { className: "fas fa-sliders" }) }), _jsx("div", { className: "side-nav-bar__search-link", children: _jsx("i", { className: "fas fa-magnifying-glass", onClick: handleSearchNavigation }) }), _jsx("div", { className: `side-nav-bar ${isMenuActive ? 'active' : 'hidden'}`, children: _jsxs("div", { className: "side-nav-bar__icon", children: [_jsxs("div", { className: "side-nav-bar__admin-control", children: [_jsx("i", { className: "fas fa-house", onClick: handleHomeNavigation }), _jsx("i", { className: "fas fa-user-plus" }), _jsx("i", { className: "fas fa-magnifying-glass", onClick: handleSearchNavigation }), _jsx("i", { className: "fas fa-heart-circle-xmark" }), _jsx("i", { className: "fas fa-music", onClick: handlePlaylistNavigation })] }), _jsx("br", {}), _jsxs("div", { className: "side-nav-bar__media-control", children: [_jsx("i", { className: "fas fa-circle-pause" }), _jsx("i", { className: "fas fa-forward-step" })] }), _jsx("span", { className: "side-nav-bar__logout", children: _jsx("i", { className: "fas fa-arrow-right-from-bracket" }) })] }) }), _jsx(SearchModal, { isOpen: isModalOpen, onClose: handleCloseModal })] }));
};
export default SideNavigation;

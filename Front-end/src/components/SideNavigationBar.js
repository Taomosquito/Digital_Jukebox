import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import '../styles/SideNavigation.scss';
import SearchModal from './SearchSong';
import { useApplication } from '../hooks/useApplicationData';
import { Link, useNavigate } from 'react-router-dom';
const SideNavigation = () => {
    const { isMenuActive, isModalOpen, isPlaylistOpen, //
    handleToggleMenu, handleSearchClick, handlePlaylistClick, //
    handleCloseModal, handleCloseSideNav } = useApplication(); // Use the custom hook for state and functions
    const navigate = useNavigate();
    const handlePlaylistNavigation = () => {
        handleCloseModal(); // Close any open modal
        handlePlaylistClick(); // Open the Playlist Modal
        handleCloseSideNav(); // Close the side navigation
        navigate('/playlist'); // Navigate to playlist route
    };
    // Function to handle search modal click and close any other modals
    const handleSearchNavigation = () => {
        handleCloseModal();
        handleSearchClick(); // Open the Search Modal
        handleCloseSideNav(); // Close the side navigation
        navigate('/search'); // Navigate to the search route
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "side-nav-bar__logo", onClick: handleToggleMenu, children: _jsx("i", { className: "fas fa-sliders" }) }), _jsx("div", { className: "side-nav-bar__search-link", onClick: handleSearchNavigation, children: _jsx("i", { className: "fas fa-magnifying-glass" }) }), _jsx("div", { className: `side-nav-bar ${isMenuActive ? 'active' : 'hidden'}`, children: _jsxs("div", { className: "side-nav-bar__icon", children: [_jsxs("div", { className: "side-nav-bar__admin-control", children: [_jsx(Link, { to: "/", children: _jsx("i", { className: "fas fa-house" }) }), _jsx("i", { className: "fas fa-user-plus" }), _jsx("i", { className: "fas fa-magnifying-glass", onClick: handleSearchNavigation }), _jsx("i", { className: "fas fa-heart-circle-xmark" }), _jsx("i", { className: "fas fa-music", onClick: handlePlaylistNavigation }), " "] }), _jsx("br", {}), _jsxs("div", { className: "side-nav-bar__media-control", children: [_jsx("i", { className: "fas fa-circle-pause" }), _jsx("i", { className: "fas fa-forward-step" })] }), _jsx("span", { className: "side-nav-bar__logout", children: _jsx("i", { className: "fas fa-arrow-right-from-bracket" }) })] }) }), _jsx(SearchModal, { isOpen: isModalOpen, onClose: handleCloseModal })] }));
};
export default SideNavigation;

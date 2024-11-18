import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import '../styles/SideNavigation.scss';
import SearchModal from './SearchSong';
import { useApplication } from '../hooks/useApplicationData';
const SideNavigation = () => {
    const { isMenuActive, isModalOpen, handleToggleMenu, handleSearchClick, handleCloseModal, handleCloseSideNav } = useApplication(); // Use the custom hook for state and functions
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "side-nav-bar__logo", onClick: handleToggleMenu, children: _jsx("i", { className: "fas fa-sliders" }) }), _jsx("div", { className: "side-nav-bar__search-link", onClick: () => {
                    handleSearchClick(); // Open the search modal
                    handleCloseSideNav(); // and close the side navigation
                }, children: _jsx("i", { className: "fas fa-magnifying-glass" }) }), _jsx("div", { className: `side-nav-bar ${isMenuActive ? 'active' : 'hidden'}`, children: _jsxs("div", { className: "side-nav-bar__icon", children: [_jsxs("div", { className: "side-nav-bar__admin-control", children: [_jsx("i", { className: "fas fa-house" }), _jsx("i", { className: "fas fa-user-plus" }), _jsx("i", { className: "fas fa-magnifying-glass", onClick: () => {
                                        handleSearchClick();
                                        handleCloseSideNav(); // Close the menu when the search is triggered
                                    } }), _jsx("i", { className: "fas fa-heart-circle-xmark" })] }), _jsx("br", {}), _jsxs("div", { className: "side-nav-bar__media-control", children: [_jsx("i", { className: "fas fa-circle-pause" }), _jsx("i", { className: "fas fa-forward-step" })] }), _jsx("span", { className: "side-nav-bar__logout", children: _jsx("i", { className: "fas fa-arrow-right-from-bracket" }) })] }) }), _jsx(SearchModal, { isOpen: isModalOpen, onClose: () => handleCloseModal(() => { }) })] }));
};
export default SideNavigation;

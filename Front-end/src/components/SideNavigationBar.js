import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import "../styles/SideNavigation.scss";
import { useEffect, useState } from "react";
import SearchModal from "./SearchSong";
import { useApplication } from "../hooks/useApplicationData";
import { useNavigate } from "react-router-dom";
import { useLoginData } from "../hooks/useLoginData";
import NavBarUser from "./NavBarUser";
import NavBarAdmin from "./NavBarAdmin";
const SideNavigation = ({ loggedIn }) => {
    const { isMenuActive, isModalOpen, handleToggleMenu, handleSearchClick, handleCloseModal, handleCloseSideNav, } = useApplication();
    const { isLoggedIn } = useLoginData();
    const [currentState, setCurrentState] = useState(false);
    // useEffect to react to changes in props or state
    useEffect(() => {
        if (isLoggedIn) {
            setCurrentState(true); // Trigger some state update on login
        }
        else {
            setCurrentState(false); // Handle logout
        }
    }, [isLoggedIn]);
    const navigate = useNavigate();
    const handleSearchNavigation = () => {
        handleSearchClick(); // Open the Search Modal
        handleCloseSideNav();
        navigate("/search");
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "side-nav-bar__logo", onClick: handleToggleMenu, children: _jsx("i", { className: "fas fa-sliders" }) }), _jsx("div", { className: "side-nav-bar__search-link", children: _jsx("i", { className: "fas fa-magnifying-glass", onClick: handleSearchNavigation }) }), _jsx("div", { className: `side-nav-bar ${isMenuActive ? "active" : "hidden"}`, children: _jsx("div", { className: "side-nav-bar__icon", children: currentState ? _jsx(NavBarUser, {}) : _jsx(NavBarAdmin, {}) }) }), _jsx(SearchModal, { isOpen: isModalOpen, onClose: handleCloseModal })] }));
};
export default SideNavigation;

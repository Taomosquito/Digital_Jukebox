import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import '../styles/SearchSong.scss';
import ClientPlayer from './ClientPlayer';
import useMusicApi from '../hooks/useMusicApi';
import { useApplication } from '../hooks/useApplicationData'; // Import the new custom hook
const SearchModal = ({ isOpen, onClose }) => {
    const { searchTerm, setSearchTerm, submittedSearchTerm, handleChange, handleSubmit, handleCloseModal, handleSelectedSongsChange, selectedSongs, handleAddToPlaylist, handleScrollDown, handleScrollUp, handleScrollLeft, handleScrollRight } = useApplication(); // Use the custom hook
    // Use the submittedSearchTerm for the API call
    const { data, loading, error } = useMusicApi(submittedSearchTerm);
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "modal-overlay", onClick: () => handleCloseModal(onClose), children: _jsxs("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), children: [_jsxs("form", { className: "search-form", onSubmit: handleSubmit, children: [_jsx("input", { className: "search-input", type: "text", placeholder: "Type here...", value: searchTerm, onChange: handleChange }), _jsx("button", { type: "submit", className: "search-button", children: "Search" })] }), _jsxs("div", { className: "search-results", children: [loading && _jsx("p", { children: "Loading..." }), error && _jsx("p", { children: "Error fetching data" }), data && data.data && data.data.length > 0 && (_jsx(_Fragment, { children: _jsx(ClientPlayer, { rawResults: data.data, onSelectedSongsChange: handleSelectedSongsChange }) }))] }), _jsx("div", { className: "scroll-buttons", children: data?.data && data.data.length > 0 && (_jsxs(_Fragment, { children: [_jsx("button", { className: "scroll-button", onClick: handleScrollDown, children: "Scroll Down" }), _jsx("button", { className: "scroll-up-button", onClick: handleScrollUp, children: "Scroll Up" }), _jsx("button", { className: "scroll-right-button", onClick: handleScrollRight, children: "Scroll Right" }), _jsx("button", { className: "scroll-left-button", onClick: handleScrollLeft, children: "Scroll Left" })] })) }), _jsxs("div", { className: "bottom-buttons", children: [selectedSongs.length > 0 && (_jsx("button", { className: "submit-playlist-button", onClick: handleAddToPlaylist, disabled: selectedSongs.length === 0, children: "Add Selected Songs to JukeBox" })), _jsx("button", { className: "close-modal", onClick: () => handleCloseModal(onClose), children: "Close" })] })] }) }));
};
export default SearchModal;

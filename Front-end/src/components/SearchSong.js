import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import '../styles/SearchSong.scss';
import ClientPlayer from './ClientPlayer';
import useMusicApi from '../hooks/useMusicApi';
const SearchModal = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState(''); // Input field value
    const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');
    const [selectedSongs, setSelectedSongs] = useState([]);
    // Use the submittedSearchTerm for the API call
    const { data, loading, error } = useMusicApi(submittedSearchTerm);
    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchTerm.trim() === '') {
            setSearchTerm('a'); // Set a default value like 'a' if searchTerm is empty (Deezer API requirement)
        }
        setSubmittedSearchTerm(searchTerm); // Trigger API call with the submitted search term
    };
    // When the modal is closed, reset search term and submitted search term
    const handleCloseModal = () => {
        setSearchTerm('');
        setSubmittedSearchTerm('');
        setSelectedSongs([]);
        onClose();
    };
    // Callback function to receive selected songs from ClientPlayer
    const handleSelectedSongsChange = (updatedSelectedSongs) => {
        setSelectedSongs(updatedSelectedSongs);
    };
    // Handle add to playlist button click
    const handleAddToPlaylist = () => {
        console.log('Songs added to playlist:', selectedSongs);
        // Reset the selected songs state after adding to playlist
        setSelectedSongs([]);
    };
    const handleScrollDown = () => {
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.scrollBy(0, 100);
        }
    };
    const handleScrollRight = () => {
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.scrollBy(100, 0);
        }
    };
    const handleScrollUp = () => {
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.scrollBy(0, -100); // Scroll up by 100px (negative value)
        }
    };
    const handleScrollLeft = () => {
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.scrollBy(-100, 0); // Scroll left by 100px (negative value)
        }
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "modal-overlay", onClick: handleCloseModal, children: _jsxs("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), children: [_jsxs("form", { className: "search-form", onSubmit: handleSubmit, children: [_jsx("input", { className: "search-input", type: "text", placeholder: "Type here...", value: searchTerm, onChange: handleChange }), _jsx("button", { type: "submit", className: "search-button", children: "Search" })] }), _jsxs("div", { className: "search-results", children: [loading && _jsx("p", { children: "Loading..." }), error && _jsx("p", { children: "Error fetching data" }), data && data.data && data.data.length > 0 && (_jsx(_Fragment, { children: _jsx(ClientPlayer, { rawResults: data.data, onSelectedSongsChange: handleSelectedSongsChange }) }))] }), _jsx("div", { className: "scroll-buttons", children: data?.data && data.data.length > 0 && (_jsxs(_Fragment, { children: [_jsx("button", { className: "scroll-button", onClick: handleScrollDown, children: "Scroll Down" }), _jsx("button", { className: "scroll-up-button", onClick: handleScrollUp, children: "Scroll Up" }), _jsx("button", { className: "scroll-right-button", onClick: handleScrollRight, children: "Scroll Right" }), _jsx("button", { className: "scroll-left-button", onClick: handleScrollLeft, children: "Scroll Left" })] })) }), _jsxs("div", { className: "bottom-buttons", children: [selectedSongs.length > 0 && (_jsx("button", { className: "submit-playlist-button", onClick: handleAddToPlaylist, disabled: selectedSongs.length === 0, children: "Add Selected Songs to JukeBox" })), _jsx("button", { className: "close-modal", onClick: handleCloseModal, children: "Close" })] })] }) }));
};
export default SearchModal;

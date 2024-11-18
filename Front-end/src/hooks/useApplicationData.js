// src/hooks/useApplication.ts
import { useState } from 'react';
export const useApplication = () => {
    // State for search and selected songs
    const [searchTerm, setSearchTerm] = useState('');
    const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');
    const [selectedSongs, setSelectedSongs] = useState([]);
    // State for side navigation and modal visibility
    const [isMenuActive, setIsMenuActive] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Handle input change for search term
    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };
    // Handle form submission for search
    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchTerm.trim() === '') {
            setSearchTerm('a'); // Default value
        }
        setSubmittedSearchTerm(searchTerm);
    };
    // Reset everything when the modal is closed
    const handleCloseModal = (onClose) => {
        setSearchTerm('');
        setSubmittedSearchTerm('');
        setSelectedSongs([]);
        setIsModalOpen(false); // Close the modal
        onClose(); // Callback to close the modal from the parent
    };
    // Update the selected songs in the parent component
    const handleSelectedSongsChange = (updatedSelectedSongs) => {
        setSelectedSongs(updatedSelectedSongs);
    };
    // Handle the add to playlist action
    const handleAddToPlaylist = () => {
        console.log('Songs added to playlist:', selectedSongs);
        setSelectedSongs([]); // Clear selected songs after adding
    };
    // Side navigation and modal toggle functions
    const handleToggleMenu = () => {
        setIsMenuActive(!isMenuActive);
    };
    const handleSearchClick = () => {
        setIsModalOpen(true); // Open the modal
    };
    const handleCloseSideNav = () => {
        setIsMenuActive(false); // Close the side navigation
    };
    // Scroll control functions
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
            searchResults.scrollBy(0, -100);
        }
    };
    const handleScrollLeft = () => {
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.scrollBy(-100, 0);
        }
    };
    return {
        searchTerm,
        setSearchTerm,
        submittedSearchTerm,
        setSubmittedSearchTerm,
        selectedSongs,
        isMenuActive,
        isModalOpen,
        handleChange,
        handleSubmit,
        handleCloseModal,
        handleSelectedSongsChange,
        handleAddToPlaylist,
        handleToggleMenu,
        handleSearchClick,
        handleCloseSideNav,
        handleScrollDown,
        handleScrollUp,
        handleScrollLeft,
        handleScrollRight
    };
};

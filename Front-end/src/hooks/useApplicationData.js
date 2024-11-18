import { useState, useRef } from 'react';
export const useApplication = () => {
    // State for search and selected songs
    const [searchTerm, setSearchTerm] = useState('');
    const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [playingSong, setPlayingSong] = useState(null); // Track play state
    const audioRefs = useRef({}); // Store refs for each audio element
    // State for side navigation and modal visibility
    const [isMenuActive, setIsMenuActive] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Organize the raw results (e.g., sorting by song title)
    const organizeResults = (results) => {
        return results.sort((a, b) => a.title.localeCompare(b.title)); // Sort by title
    };
    // Format the song duration into a readable time format
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };
    // Handle checkbox change: add or remove songs from the selected list
    const handleCheckboxChange = (song, isChecked) => {
        setSelectedSongs((prev) => {
            const updatedSelection = isChecked
                ? [...prev, song] // Add song if checked
                : prev.filter((s) => s.id !== song.id); // Remove song if unchecked
            return updatedSelection;
        });
    };
    // Handle play/pause click
    const handlePlayClick = (song) => {
        if (audioRefs.current[song.id]) {
            if (playingSong === song.id) {
                // If the clicked song is already playing, pause it
                audioRefs.current[song.id]?.pause();
                setPlayingSong(null); // Reset the playing song state
            }
            else {
                // Pause the currently playing song
                if (playingSong !== null && audioRefs.current[playingSong]) {
                    audioRefs.current[playingSong]?.pause();
                }
                // Play the new song
                audioRefs.current[song.id]?.play();
                setPlayingSong(song.id); // Update the currently playing song state
            }
        }
    };
    // Update the selected songs in the parent component
    const handleSelectedSongsChange = (updatedSelectedSongs) => {
        setSelectedSongs(updatedSelectedSongs);
    };
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
        setIsModalOpen(true);
    };
    const handleCloseSideNav = () => {
        setIsMenuActive(false);
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
        isMenuActive,
        isModalOpen,
        selectedSongs,
        playingSong,
        audioRefs,
        organizeResults,
        formatDuration,
        handleCheckboxChange,
        handlePlayClick,
        handleSelectedSongsChange,
        handleChange,
        handleSubmit,
        handleCloseModal,
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

import { useState, useRef } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import axios from "axios";
export const useApplication = () => {
    const socket = useWebSocket();
    // State for search and selected songs
    const [searchTerm, setSearchTerm] = useState("");
    const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [playingSong, setPlayingSong] = useState(null); // Track play state
    const audioRefs = useRef({}); // Store refs for each audio element
    // State for side navigation and modal visibility
    const [isMenuActive, setIsMenuActive] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPlaylistOpen, setIsPlaylistOpen] = useState(false); //Manage Playlist()
    const [message, setMessage] = useState("");
    // // Organize the raw results (e.g., sorting by song title)
    // const organizeResults = (results: any[]) => {
    //   return results.sort((a, b) => a.title.localeCompare(b.title)); // Sort by title
    // };
    // Format the song duration into a readable time format
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
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
        if (searchTerm.trim() === "") {
            setSubmittedSearchTerm("");
        }
        else {
            setSubmittedSearchTerm(searchTerm.trim());
        }
    };
    // Reset everything when the modal is closed
    // const handleCloseModal = (onClose: () => void) => {
    const handleCloseModal = (onClose = () => { }) => {
        setSearchTerm("");
        setSubmittedSearchTerm("");
        setSelectedSongs([]);
        setIsModalOpen(false); // Close the modal
        onClose(); // Callback to close the modal from the parent
    };
    // Handle the add to playlist action
    const handleAddToPlaylist = async () => {
        console.log("Songs added to playlist:", selectedSongs);
        try {
            const response = await axios.post("http://localhost:3000/addSongs", selectedSongs, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log(response.data);
            // *Emit the event via WebSocket to notify other clients about the new songs
            if (socket) {
                socket.emit("songAdded", selectedSongs);
            }
            setSelectedSongs([]); // Clear selected songs after adding
            return response.data; // Return the response data to the caller
        }
        catch (error) {
            console.error("Error adding songs:", error);
            throw new Error("Failed to add songs");
        }
    };
    //To Delete all songs
    const handleDeleteAllSongs = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete all songs?");
        if (!confirmDelete)
            return;
        try {
            const response = await axios.delete("http://localhost:3000/songs");
            if (response.status === 200) {
                setMessage("All songs deleted successfully.");
            }
            else {
                setMessage("Failed to delete songs. Please try again later.");
            }
        }
        catch (error) {
            console.error("Error deleting songs:", error);
            setMessage("Failed to delete songs. Please try again later.");
        }
    };
    // Side navigation and modal toggle functions
    const handleToggleMenu = () => {
        setIsMenuActive(!isMenuActive);
    };
    const handleHomeClick = () => {
        setIsModalOpen(false); //Ensure search modal is closed.
        setIsPlaylistOpen(false); // ensure the playlist modal is closed.
    };
    const handleSearchClick = () => {
        setIsModalOpen(true);
        setIsPlaylistOpen(false); // Ensure playlist modal is closed
    };
    // Open the playlist modal
    const handlePlaylistClick = () => {
        setIsPlaylistOpen(true); // Open playlist modal
        setIsModalOpen(false); // Ensure search modal is closed
    };
    const handleCloseSideNav = () => {
        setIsMenuActive(false);
    };
    // Scroll control functions
    const handleScrollDown = () => {
        const searchResults = document.querySelector(".search-results");
        if (searchResults) {
            searchResults.scrollBy(0, 100);
        }
    };
    const handleScrollRight = () => {
        const searchResults = document.querySelector(".search-results");
        if (searchResults) {
            searchResults.scrollBy(100, 0);
        }
    };
    const handleScrollUp = () => {
        const searchResults = document.querySelector(".search-results");
        if (searchResults) {
            searchResults.scrollBy(0, -100);
        }
    };
    const handleScrollLeft = () => {
        const searchResults = document.querySelector(".search-results");
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
        isPlaylistOpen,
        selectedSongs,
        playingSong,
        audioRefs,
        //organizeResults,
        formatDuration,
        handleCheckboxChange,
        handlePlayClick,
        handleSelectedSongsChange,
        handleChange,
        handleSubmit,
        handleCloseModal,
        handleAddToPlaylist,
        handleDeleteAllSongs,
        handleToggleMenu,
        handleHomeClick,
        handleSearchClick,
        handlePlaylistClick,
        handleCloseSideNav,
        handleScrollDown,
        handleScrollUp,
        handleScrollLeft,
        handleScrollRight,
    };
};

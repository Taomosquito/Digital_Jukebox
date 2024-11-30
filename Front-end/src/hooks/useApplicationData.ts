import { useState, useRef } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import axios from "axios";

export const useApplication = () => {
  const socket = useWebSocket();
  // State for search and selected songs
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
  const [selectedSongs, setSelectedSongs] = useState<any[]>([]);
  const [playingSong, setPlayingSong] = useState<string | null>(null); // Track play state
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({}); // Store refs for each audio element

  // State for side navigation and modal visibility
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false); //Manage Playlist()

  const [message, setMessage] = useState<string>("");

  // Format the song duration into a readable time format
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Handle checkbox change: add or remove songs from the selected list
  const handleCheckboxChange = (song: any, isChecked: boolean) => {
    setSelectedSongs((prev) => {
      const updatedSelection = isChecked
        ? [...prev, song] // Add song if checked
        : prev.filter((s) => s.id !== song.id); // Remove song if unchecked
      return updatedSelection;
    });
  };

  // Handle play/pause click
  const handlePlayClick = (song: any) => {
    if (audioRefs.current[song.id]) {
      if (playingSong === song.id) {
        // If the clicked song is already playing, pause it
        audioRefs.current[song.id]?.pause();
        setPlayingSong(null); // Reset the playing song state
      } else {
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
  const handleSelectedSongsChange = (updatedSelectedSongs: any[]) => {
    setSelectedSongs(updatedSelectedSongs);
  };

  // Handle input change for search term
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle form submission for search
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchTerm.trim() === "") {
      setSubmittedSearchTerm("");
    } else {
      setSubmittedSearchTerm(searchTerm.trim());
    }
  };

  // Reset everything when the modal is closed
  // const handleCloseModal = (onClose: () => void) => {
  const handleCloseModal = (onClose: () => void = () => {}) => {
    setSearchTerm("");
    setSubmittedSearchTerm("");
    setSelectedSongs([]);
    setIsModalOpen(false); // Close the modal
    onClose(); // Callback to close the modal from the parent
  };

  // Handle the add to playlist action
  const handleAddToPlaylist = async () => {
    console.log("Selected songs to be added:", selectedSongs);

    try {
      const response = await axios.post<any>(
        "/back-end/addSongs",
        selectedSongs,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSelectedSongs([]); // Clear selected songs after adding

      return response.data; // Return the response data to the caller,see server
    } catch (error: any) {
      console.error("Error adding songs:", error);
      throw new Error("Failed to add songs");
    }
  };

  //To Delete all songs
  const handleDeleteAllSongs = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all songs?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete("/back-end/songs");
      if (response.status === 200) {
        setMessage("All songs deleted successfully.");
      } else {
        setMessage("Failed to delete songs. Please try again later.");
      }
    } catch (error: any) {
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

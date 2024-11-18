// src/hooks/useApplication.ts
import { useState } from 'react';

export const useApplication = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');
  const [selectedSongs, setSelectedSongs] = useState<any[]>([]);

  // Handle input change for search term
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle form submission for search
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchTerm.trim() === '') {
      setSearchTerm('a'); // Default value
    }
    setSubmittedSearchTerm(searchTerm);
  };

  // Reset everything when the modal is closed
  const handleCloseModal = (onClose: () => void) => {
    setSearchTerm('');
    setSubmittedSearchTerm('');
    setSelectedSongs([]);
    onClose(); // Callback to close the modal
  };

  // Update the selected songs in the parent component
  const handleSelectedSongsChange = (updatedSelectedSongs: any[]) => {
    setSelectedSongs(updatedSelectedSongs);
  };

  // Handle the add to playlist action
  const handleAddToPlaylist = () => {
    console.log('Songs added to playlist:', selectedSongs);
    setSelectedSongs([]); // Clear selected songs after adding
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
    handleChange,
    handleSubmit,
    handleCloseModal,
    handleSelectedSongsChange,
    handleAddToPlaylist,
    handleScrollDown,
    handleScrollUp,
    handleScrollLeft,
    handleScrollRight
  };
};

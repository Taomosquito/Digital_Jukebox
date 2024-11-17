import React, { useState } from 'react';
import '../styles/SearchSong.scss';
import ClientPlayer from './ClientPlayer';  // Import the ClientPlayer to display organized results
import useMusicApi from '../hooks/useMusicApi';  // Import the hook for searching

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState(''); // The input field value
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState(''); // Track the submitted search term

  // Use the submittedSearchTerm for the API call
  const { data, loading, error } = useMusicApi(submittedSearchTerm);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); // Update the input field value
  };

  // Handle form submission, which will trigger the search
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submit behavior
    if (searchTerm.trim() === '') {
      setSearchTerm('a');  // Set a default value like 'a' if searchTerm is empty (Deezer API requirement)
    }
    setSubmittedSearchTerm(searchTerm); // Only trigger the API call with the submitted search term
  };

  const handleScrollDown = () => {
    const resultsContainer = document.querySelector('.search-results');
    if (resultsContainer) {
      resultsContainer.scrollTop += 100; // Scroll 100px down on button click
    }
  };

  // When the modal is closed, reset search term and submitted search term
  const handleCloseModal = () => {
    setSearchTerm('');          // Clear the search input
    setSubmittedSearchTerm(''); // Clear the submitted search term (clear results)
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Form for the search */}
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            className="search-input"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleChange}
          />
          <button type="submit" className="search-button">
            Submit
          </button>
        </form>

        {/* Search results area */}
        <div className="search-results">
          {loading && <p>Loading...</p>}
          {error && <p>Error fetching data</p>}
          {data && data.data && data.data.length > 0 && <ClientPlayer rawResults={data.data} />}  {/* Pass raw results to ClientPlayer */}
        </div>

        {/* Scroll button */}
        {data?.data && data.data.length > 0 && (
          <button className="scroll-button" onClick={handleScrollDown}>
            Scroll Down
          </button>
        )}

        {/* Close button */}
        <button className="close-modal" onClick={handleCloseModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SearchModal;

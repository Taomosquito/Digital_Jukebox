// This component is responsible for searching song. Appears to be a modal.
import React, { useState } from 'react';
import '../styles/SearchSong.scss';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]); // Example list of search results
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Search for:', searchTerm);

    // Example search logic
    // In a real app, you would replace this with actual search API call
    const results = Array(10).fill('Song').map((_, index) => `Song ${index + 1}`);
    setSearchResults(results);

    // Show the scroll button if there are more than 2 results
    if (results.length > 2) {
      setShowScrollButton(true);
    }
  };

  const handleScrollDown = () => {
    const resultsContainer = document.querySelector('.search-results');
    if (resultsContainer) {
      resultsContainer.scrollTop += 100; // Scroll 100px down on button click
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            className="search-input"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleChange}
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {/* Search results area */}
        <div className="search-results">
          {searchResults.slice(0, 2).map((result, index) => (
            <div key={index} className="result-item">
              {result}
            </div>
          ))}
        </div>

        {/* Scroll button */}
        {showScrollButton && (
          <button className="scroll-button" onClick={handleScrollDown}>
            Scroll Down
          </button>
        )}

        {/* Close button */}
        <button className="close-modal" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SearchModal;

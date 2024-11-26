import '../styles/SearchSong.scss';
import TrackListManager from './TrackListManager';
import useMusicApi from '../hooks/useMusicApi';
import { useApplication } from '../hooks/useApplicationData';
import { useNavigate } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const {
    searchTerm,
    setSearchTerm,
    submittedSearchTerm,
    handleChange,
    handleSubmit,
    handleCloseModal,
    selectedSongs,
    handleAddToPlaylist,
    handleScrollDown,
    handleScrollUp,
    handleScrollLeft,
    handleScrollRight,
    handleSelectedSongsChange, // Access this from useApplication hook
  } = useApplication();

  const navigate = useNavigate();
  const { data, loading, error } = useMusicApi(submittedSearchTerm);

  const handleCloseAndRedirect = async () => {
    await handleAddToPlaylist(); // Ensure songs are added before redirect
    handleCloseModal(onClose);  // Close the modal
    navigate('/playlist');  // Redirect to playlist
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Form for the search */}
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            className="search-input"
            type="text"
            placeholder="Type here..."
            value={searchTerm}
            onChange={handleChange}
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {/* Search results area */}
        <div className="search-results">
          {loading && <p>Loading...</p>}
          {error && <p>Error fetching data</p>}
          {data && data.data && data.data.length > 0 && (
            <TrackListManager
              rawResults={data.data}
              onSelectedSongsChange={handleSelectedSongsChange}
            />
          )}
        </div>

        {/* Scroll buttons */}
        <div className="scroll-buttons">
          {data?.data && data.data.length > 0 && (
            <>
              <button className="scroll-button" onClick={handleScrollDown}>
                Scroll Down
              </button>
              <button className="scroll-up-button" onClick={handleScrollUp}>
                Scroll Up
              </button>

              <button className="scroll-right-button" onClick={handleScrollRight}>
                Scroll Right
              </button>
              <button className="scroll-left-button" onClick={handleScrollLeft}>
                Scroll Left
              </button>
            </>
          )}
        </div>

        {/* Bottom buttons */}
        <div className="bottom-buttons">
          {selectedSongs.length > 0 && (
            <button
              className="submit-playlist-button"
              onClick={handleAddToPlaylist}
              disabled={selectedSongs.length === 0}
            >
              Add Selected Songs to JukeBox
            </button>
          )}

          <button className="close-modal" onClick={handleCloseAndRedirect}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

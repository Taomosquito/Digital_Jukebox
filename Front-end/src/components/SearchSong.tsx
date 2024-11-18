// import React, { useState } from 'react';
// import '../styles/SearchSong.scss';
// import ClientPlayer from './ClientPlayer';
// import useMusicApi from '../hooks/useMusicApi';

// interface SearchModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
//   const [searchTerm, setSearchTerm] = useState(''); // Input field value
//   const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');
//   const [selectedSongs, setSelectedSongs] = useState<any[]>([]);

//   // Use the submittedSearchTerm for the API call
//   const { data, loading, error } = useMusicApi(submittedSearchTerm);

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     if (searchTerm.trim() === '') {
//       setSearchTerm('a');  // Set a default value like 'a' if searchTerm is empty (Deezer API requirement)
//     }
//     setSubmittedSearchTerm(searchTerm); // Trigger API call with the submitted search term
//   };

//   // When the modal is closed, reset search term and submitted search term
//   const handleCloseModal = () => {
//     setSearchTerm('');
//     setSubmittedSearchTerm('');
//     setSelectedSongs([]);
//     onClose();
//   };

//   // Callback function to receive selected songs from ClientPlayer
//   const handleSelectedSongsChange = (updatedSelectedSongs: any[]) => {
//     setSelectedSongs(updatedSelectedSongs);
//   };

//   // Handle add to playlist button click
//   const handleAddToPlaylist = () => {
//     console.log('Songs added to playlist:', selectedSongs);
//     // Reset the selected songs state after adding to playlist
//     setSelectedSongs([]);
//   };

//   const handleScrollDown = () => {
//     const searchResults = document.querySelector('.search-results');
//     if (searchResults) {
//       searchResults.scrollBy(0, 100);
//     }
//   };

//   const handleScrollRight = () => {
//     const searchResults = document.querySelector('.search-results');
//     if (searchResults) {
//       searchResults.scrollBy(100, 0);
//     }
//   };

//   const handleScrollUp = () => {
//     const searchResults = document.querySelector('.search-results');
//     if (searchResults) {
//       searchResults.scrollBy(0, -100); // Scroll up by 100px (negative value)
//     }
//   };
  
//   const handleScrollLeft = () => {
//     const searchResults = document.querySelector('.search-results');
//     if (searchResults) {
//       searchResults.scrollBy(-100, 0); // Scroll left by 100px (negative value)
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay" onClick={handleCloseModal}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         {/* Form for the search */}
//         <form className="search-form" onSubmit={handleSubmit}>
//           <input
//             className="search-input"
//             type="text"
//             placeholder="Type here..."
//             value={searchTerm}
//             onChange={handleChange}
//           />
//           <button type="submit" className="search-button">
//             Search
//           </button>
//         </form>

//         {/* Search results area */}
//         <div className="search-results">
//           {loading && <p>Loading...</p>}
//           {error && <p>Error fetching data</p>}
//           {data && data.data && data.data.length > 0 && (
//             <>
//               {/* ClientPlayer receives raw results and provides selected songs */}
//               <ClientPlayer rawResults={data.data} onSelectedSongsChange={handleSelectedSongsChange} />             
//             </>
//           )}
//         </div>

//         <div className="scroll-buttons">
//           {data?.data && data.data.length > 0 && (
//             <>
//               <button className="scroll-button" onClick={handleScrollDown}>
//                 Scroll Down
//               </button>
//               <button className="scroll-up-button" onClick={handleScrollUp}>
//                 Scroll Up
//               </button>

//               <button className="scroll-right-button" onClick={handleScrollRight}>
//                 Scroll Right
//               </button>
//               <button className="scroll-left-button" onClick={handleScrollLeft}>
//                 Scroll Left
//               </button>
//             </>
//           )}
//         </div>

//         <div className="bottom-buttons">
//           {selectedSongs.length > 0 && (
//                 <button
//                   className="submit-playlist-button"
//                   onClick={handleAddToPlaylist}
//                   disabled={selectedSongs.length === 0} // Disable if no songs are selected
//                 >
//                   Add Selected Songs to JukeBox
//                 </button>
//               )}

//           <button className="close-modal" onClick={handleCloseModal}>
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchModal;


// src/components/SearchModal.tsx
import React from 'react';
import '../styles/SearchSong.scss';
import ClientPlayer from './ClientPlayer';
import useMusicApi from '../hooks/useMusicApi';
import { useApplication } from '../hooks/useApplicationData'; // Import the new custom hook

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
    handleSelectedSongsChange,
    selectedSongs,
    handleAddToPlaylist,
    handleScrollDown,
    handleScrollUp,
    handleScrollLeft,
    handleScrollRight
  } = useApplication(); // Use the custom hook

  // Use the submittedSearchTerm for the API call
  const { data, loading, error } = useMusicApi(submittedSearchTerm);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => handleCloseModal(onClose)}>
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
            <>
              <ClientPlayer
                rawResults={data.data}
                onSelectedSongsChange={handleSelectedSongsChange}
              />
            </>
          )}
        </div>

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

          <button className="close-modal" onClick={() => handleCloseModal(onClose)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

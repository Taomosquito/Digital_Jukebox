import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// import React from 'react';
// import '../styles/SearchSong.scss';
// import TrackListManager from './TrackListManager';
// import useMusicApi from '../hooks/useMusicApi';
// import { useApplication } from '../hooks/useApplicationData';
// interface SearchModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }
// const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
//   const {
//     searchTerm,
//     setSearchTerm,
//     submittedSearchTerm,
//     handleChange,
//     handleSubmit,
//     handleCloseModal,
//     selectedSongs,
//     handleAddToPlaylist,
//     handleScrollDown,
//     handleScrollUp,
//     handleScrollLeft,
//     handleScrollRight,
//     handleSelectedSongsChange // Access this from useApplication hook
//   } = useApplication();
//   const { data, loading, error } = useMusicApi(submittedSearchTerm);
//   if (!isOpen) return null;
//   return (
//     <div className="modal-overlay" onClick={() => handleCloseModal(onClose)}>
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
//               <TrackListManager
//                 rawResults={data.data}
//                 onSelectedSongsChange={handleSelectedSongsChange}
//               />
//             </>
//           )}
//         </div>
//         {/* Scroll buttons */}
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
//         {/* Bottom buttons */}
//         <div className="bottom-buttons">
//           {selectedSongs.length > 0 && (
//             <button
//               className="submit-playlist-button"
//               onClick={handleAddToPlaylist}
//               disabled={selectedSongs.length === 0}
//             >
//               Add Selected Songs to JukeBox
//             </button>
//           )}
//           <button className="close-modal" onClick={() => handleCloseModal(onClose)}>
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default SearchModal;
import '../styles/SearchSong.scss';
import TrackListManager from './TrackListManager';
import useMusicApi from '../hooks/useMusicApi';
import { useApplication } from '../hooks/useApplicationData';
const SearchModal = ({ isOpen, onClose }) => {
    const { searchTerm, setSearchTerm, submittedSearchTerm, handleChange, handleSubmit, handleCloseModal, selectedSongs, handleAddToPlaylist, handleScrollDown, handleScrollUp, handleScrollLeft, handleScrollRight, handleSelectedSongsChange // Access this from useApplication hook
     } = useApplication();
    const { data, loading, error } = useMusicApi(submittedSearchTerm);
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "modal-overlay", onClick: () => handleCloseModal(onClose), children: _jsxs("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), children: [_jsxs("form", { className: "search-form", onSubmit: handleSubmit, children: [_jsx("input", { className: "search-input", type: "text", placeholder: "Type here...", value: searchTerm, onChange: handleChange }), _jsx("button", { type: "submit", className: "search-button", children: "Search" })] }), _jsxs("div", { className: "search-results", children: [loading && _jsx("p", { children: "Loading..." }), error && _jsx("p", { children: "Error fetching data" }), data && data.data && data.data.length > 0 && (_jsx(TrackListManager, { rawResults: data.data, onSelectedSongsChange: handleSelectedSongsChange }))] }), _jsx("div", { className: "scroll-buttons", children: data?.data && data.data.length > 0 && (_jsxs(_Fragment, { children: [_jsx("button", { className: "scroll-button", onClick: handleScrollDown, children: "Scroll Down" }), _jsx("button", { className: "scroll-up-button", onClick: handleScrollUp, children: "Scroll Up" }), _jsx("button", { className: "scroll-right-button", onClick: handleScrollRight, children: "Scroll Right" }), _jsx("button", { className: "scroll-left-button", onClick: handleScrollLeft, children: "Scroll Left" })] })) }), _jsxs("div", { className: "bottom-buttons", children: [selectedSongs.length > 0 && (_jsx("button", { className: "submit-playlist-button", onClick: handleAddToPlaylist, disabled: selectedSongs.length === 0, children: "Add Selected Songs to JukeBox" })), _jsx("button", { className: "close-modal", onClick: () => handleCloseModal(onClose), children: "Close" })] })] }) }));
};
export default SearchModal;

// import React, { useState, useEffect, useRef } from 'react';
// import { useApplication } from '../hooks/useApplicationData';
// import '../styles/TrackListManager.scss';

// interface TrackListManagerProps {
//   rawResults: any[];
//   selectedSongs: any[]; // Add this line
//   onSelectedSongsChange: (selectedSongs: any[]) => void; // Callback to notify parent
// }

// const TrackListManager = ({ rawResults, onSelectedSongsChange }: TrackListManagerProps) => {
//   const [selectedSongs, setSelectedSongs] = useState<any[]>([]); // Local state for selected songs
//   const { audioRefs, playingSong, handlePlayClick, formatDuration } = useApplication();

//   // Debounced effect for sending selected songs to parent component
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onSelectedSongsChange(selectedSongs); // Send selected songs to parent after debounce
//     }, 500); // Debounce for 500ms

//     return () => clearTimeout(timer); // Cleanup the timer on every change
//   }, [selectedSongs, onSelectedSongsChange]);

//   // Function to handle song selection/deselection
//   // const handleCheckboxChange = (song: any, isChecked: boolean) => {
//   //   setSelectedSongs((prev) => {
//   //     const updatedSelection = isChecked
//   //       ? [...prev, song] // Add song if checked
//   //       : prev.filter((s) => s.id !== song.id); // Remove song if unchecked
//   //     return updatedSelection;
//   //   });
//   // };
//   const handleCheckboxChange = (song: any, isChecked: boolean) => {
//     const updatedSelection = isChecked
//       ? [...selectedSongs, song] // Add song if checked
//       : selectedSongs.filter((s) => s.id !== song.id); // Remove song if unchecked
//     onSelectedSongsChange(updatedSelection); // Update parent state
//   };

//   // Organize the raw results (e.g., sorting by song title)
//   const organizeResults = (results: any[]) => {
//     return results.sort((a, b) => a.title.localeCompare(b.title)); // Sort by title
//   };

//   const organizedResults = organizeResults(rawResults); // Organize the raw data

//   return (
//     <div className='track_list_mgr'>
//       {organizedResults.length > 0 ? (
//         <table>
//           <thead>
//             <tr>
//               <th>Album</th>
//               <th>Track</th>
//               <th>Artist</th>
//               <th>Time</th>
//               <th>Preview</th>
//               <th>Add to Playlist</th>
//             </tr>
//           </thead>
//           <tbody>
//             {organizedResults.map((song) => (
//               <tr key={song.id}>
//                 <td>
//                   <img src={song.album.cover} alt={song.title} width="50" height="50" />
//                 </td>
//                 <td className='track-list-mgr__title'>{song.title}</td>
//                 <td className='track-list-mgr__artist'>{song.artist.name}</td>
//                 <td>{formatDuration(song.duration)}</td>
//                 <td> 
//                   <i
//                     className={`fa-solid ${playingSong === song.id ? 'fa-pause' : 'fa-play'}`}
//                     onClick={() => handlePlayClick(song)}
//                   ></i>
//                   <audio ref={(el) => { audioRefs.current[song.id] = el }} hidden>
//                     <source src={song.preview} type="audio/mp3" />
//                   </audio>
//                 </td>
//                 <td>
//                   <input
//                     type="checkbox"
//                     checked={selectedSongs.some((s) => s.id === song.id)} // Check if the song is selected
//                     onChange={(e) => handleCheckboxChange(song, e.target.checked)} // Handle checkbox change
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No results found.</p>
//       )}
//     </div>
//   );
// };

// export default TrackListManager;

import React from 'react';
import { useApplication } from '../hooks/useApplicationData';
import '../styles/TrackListManager.scss';

interface TrackListManagerProps {
  rawResults: any[];
  selectedSongs: any[]; // Prop to receive selected songs from parent
  onSelectedSongsChange: (selectedSongs: any[]) => void; // Callback to notify parent
}

const TrackListManager: React.FC<TrackListManagerProps> = ({ rawResults, selectedSongs, onSelectedSongsChange }) => {
  const { audioRefs, playingSong, handlePlayClick, formatDuration } = useApplication();

  // Function to handle song selection/deselection
  const handleCheckboxChange = (song: any, isChecked: boolean) => {
    const updatedSelection = isChecked
      ? [...selectedSongs, song] // Add song if checked
      : selectedSongs.filter((s) => s.id !== song.id); // Remove song if unchecked
    onSelectedSongsChange(updatedSelection); // Notify parent of the updated selection
  };

  // Organize the raw results (e.g., sorting by song title)
  const organizeResults = (results: any[]) => {
    return results.sort((a, b) => a.title.localeCompare(b.title)); // Sort by title
  };

  const organizedResults = organizeResults(rawResults); // Organize the raw data

  return (
    <div className="track_list_mgr">
      {organizedResults.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Album</th>
              <th>Track</th>
              <th>Artist</th>
              <th>Time</th>
              <th>Preview</th>
              <th>Add to Playlist</th>
            </tr>
          </thead>
          <tbody>
            {organizedResults.map((song) => (
              <tr key={song.id}>
                <td>
                  <img src={song.album.cover} alt={song.title} width="50" height="50" />
                </td>
                <td className="track-list-mgr__title">{song.title}</td>
                <td className="track-list-mgr__artist">{song.artist.name}</td>
                <td>{formatDuration(song.duration)}</td>
                <td>
                  <i
                    className={`fa-solid ${playingSong === song.id ? 'fa-pause' : 'fa-play'}`}
                    onClick={() => handlePlayClick(song)}
                  ></i>
                  <audio ref={(el) => { audioRefs.current[song.id] = el }} hidden>
                    <source src={song.preview} type="audio/mp3" />
                  </audio>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedSongs.some((s) => s.id === song.id)} // Check if the song is selected
                    onChange={(e) => handleCheckboxChange(song, e.target.checked)} // Handle checkbox change
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default TrackListManager;

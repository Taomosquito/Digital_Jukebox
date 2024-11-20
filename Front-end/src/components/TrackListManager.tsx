// import React, { useState, useEffect, useRef } from 'react';
// import { useApplication } from '../hooks/useApplicationData';

// interface TrackListManagerProps {
//   rawResults: any[];
//   onSelectedSongsChange: (selectedSongs: any[]) => void; // Callback to notify parent
// }

// const TrackListManager = ({ rawResults, onSelectedSongsChange }: TrackListManagerProps) => {
//   const [selectedSongs, setSelectedSongs] = useState<any[]>([]); // Local state for selected songs

//   // Function to handle song selection/deselection
//   const handleCheckboxChange = (song: any, isChecked: boolean) => {
//     setSelectedSongs((prev) => {
//       const updatedSelection = isChecked
//         ? [...prev, song] // Add song if checked
//         : prev.filter((s) => s.id !== song.id); // Remove song if unchecked

//       // Notify the parent component with the updated list of selected songs
//       onSelectedSongsChange(updatedSelection); // Pass updated list to parent (SearchModal)
//       return updatedSelection;
//     });
//   };

//   const { audioRefs, playingSong, handlePlayClick, formatDuration } = useApplication();

//   useEffect(() => {
//     // Send the current selected songs list to the parent component
//     onSelectedSongsChange(selectedSongs);
//   }, [selectedSongs, onSelectedSongsChange]);

//   // Organize the raw results (e.g., sorting by song title)
//   const organizeResults = (results: any[]) => {
//     return results.sort((a, b) => a.title.localeCompare(b.title));
//   };

//   const organizedResults = organizeResults(rawResults); // Organize the raw data

//   return (
//     <div>
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
//                 <td>{song.title}</td>
//                 <td>{song.artist.name}</td>
//                 <td>{formatDuration(song.duration)}</td>
//                 <td> <i
//                         className={`fa-solid ${playingSong === song.id ? 'fa-pause' : 'fa-play'}`}
//                         onClick={() => handlePlayClick(song)}
//                       ></i>
//                       <audio ref={(el) => { audioRefs.current[song.id] = el }} hidden>
//                         <source src={song.preview} type="audio/mp3" />
//                       </audio>
//                 </td>
//                 <td>
//                   <input
//                     type="checkbox"
//                     checked={selectedSongs.some((s) => s.id === song.id)}  // Check if the song is selected
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


import React, { useState, useEffect, useRef } from 'react';
import { useApplication } from '../hooks/useApplicationData';

interface TrackListManagerProps {
  rawResults: any[];
  onSelectedSongsChange: (selectedSongs: any[]) => void; // Callback to notify parent
}

const TrackListManager = ({ rawResults, onSelectedSongsChange }: TrackListManagerProps) => {
  const [selectedSongs, setSelectedSongs] = useState<any[]>([]); // Local state for selected songs
  const { audioRefs, playingSong, handlePlayClick, formatDuration } = useApplication();

  // Debounced effect for sending selected songs to parent component
  useEffect(() => {
    const timer = setTimeout(() => {
      onSelectedSongsChange(selectedSongs); // Send selected songs to parent after debounce
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timer); // Cleanup the timer on every change
  }, [selectedSongs, onSelectedSongsChange]);

  // Function to handle song selection/deselection
  const handleCheckboxChange = (song: any, isChecked: boolean) => {
    setSelectedSongs((prev) => {
      const updatedSelection = isChecked
        ? [...prev, song] // Add song if checked
        : prev.filter((s) => s.id !== song.id); // Remove song if unchecked
      return updatedSelection;
    });
  };

  // Organize the raw results (e.g., sorting by song title)
  const organizeResults = (results: any[]) => {
    return results.sort((a, b) => a.title.localeCompare(b.title)); // Sort by title
  };

  const organizedResults = organizeResults(rawResults); // Organize the raw data

  return (
    <div>
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
                <td>{song.title}</td>
                <td>{song.artist.name}</td>
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

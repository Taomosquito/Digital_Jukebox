import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import React from 'react';
// interface ClientPlayerProps {
//   rawResults: any[];  // Receive raw results to organize
// }
// const ClientPlayer = ({ rawResults }: ClientPlayerProps) => {
//   // This function organizes the raw results (e.g., sorting by song title)
//   const organizeResults = (results: any[]) => {
//     return results.sort((a, b) => a.title.localeCompare(b.title)); // Sort the result by title or track name
//   };
//   const organizedResults = organizeResults(rawResults);
//   const formatDuration = (seconds: number): string => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
//   };
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
//               <th>Action</th>
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
//                 <td>
//                   <audio controls>
//                     <source src={song.preview} type="audio/mp3" />
//                   </audio>
//                 </td>
//                 <td>"Add link Pending"</td>
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
// export default ClientPlayer;
import { useState } from 'react';
const ClientPlayer = ({ rawResults, onSelectedSongsChange }) => {
    // Organize the raw results (e.g., sorting by song title)
    const organizeResults = (results) => {
        return results.sort((a, b) => a.title.localeCompare(b.title)); // Sort by title
    };
    const organizedResults = organizeResults(rawResults);
    // Format the song duration into a readable time format
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };
    const [selectedSongs, setSelectedSongs] = useState([]); // Track selected songs
    // Handle checkbox change: add or remove songs from the selected list
    const handleCheckboxChange = (song, isChecked) => {
        setSelectedSongs((prev) => {
            const updatedSelection = isChecked
                ? [...prev, song] // Add song if checked
                : prev.filter((s) => s.id !== song.id); // Remove song if unchecked
            // Notify the parent component with the updated list of selected songs
            onSelectedSongsChange(updatedSelection);
            return updatedSelection;
        });
    };
    return (_jsx("div", { children: organizedResults.length > 0 ? (_jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Album" }), _jsx("th", { children: "Track" }), _jsx("th", { children: "Artist" }), _jsx("th", { children: "Time" }), _jsx("th", { children: "Preview" }), _jsx("th", { children: "Add to Playlist" })] }) }), _jsx("tbody", { children: organizedResults.map((song) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("img", { src: song.album.cover, alt: song.title, width: "50", height: "50" }) }), _jsx("td", { children: song.title }), _jsx("td", { children: song.artist.name }), _jsx("td", { children: formatDuration(song.duration) }), _jsx("td", { children: _jsx("audio", { controls: true, children: _jsx("source", { src: song.preview, type: "audio/mp3" }) }) }), _jsx("td", { children: _jsx("input", { type: "checkbox", checked: selectedSongs.some((s) => s.id === song.id), onChange: (e) => handleCheckboxChange(song, e.target.checked) }) })] }, song.id))) })] })) : (_jsx("p", { children: "No results found." })) }));
};
export default ClientPlayer;

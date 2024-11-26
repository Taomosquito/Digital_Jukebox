import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useApplication } from '../hooks/useApplicationData';
import '../styles/TrackListManager.scss';
const TrackListManager = ({ rawResults, selectedSongs, onSelectedSongsChange }) => {
    const { audioRefs, playingSong, handlePlayClick, formatDuration } = useApplication();
    // Function to handle song selection/deselection
    const handleCheckboxChange = (song, isChecked) => {
        const updatedSelection = isChecked
            ? [...selectedSongs, song] // Add song if checked
            : selectedSongs.filter((s) => s.id !== song.id); // Remove song if unchecked
        onSelectedSongsChange(updatedSelection); // Notify parent of the updated selection
    };
    // Organize the raw results (e.g., sorting by song title)
    const organizeResults = (results) => {
        return results.sort((a, b) => a.title.localeCompare(b.title)); // Sort by title
    };
    const organizedResults = organizeResults(rawResults); // Organize the raw data
    return (_jsx("div", { className: "track_list_mgr", children: organizedResults.length > 0 ? (_jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Album" }), _jsx("th", { children: "Track" }), _jsx("th", { children: "Artist" }), _jsx("th", { children: "Time" }), _jsx("th", { children: "Preview" }), _jsx("th", { children: "Add to Playlist" })] }) }), _jsx("tbody", { children: organizedResults.map((song) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("img", { src: song.album.cover, alt: song.title, width: "50", height: "50" }) }), _jsx("td", { className: "track-list-mgr__title", children: song.title }), _jsx("td", { className: "track-list-mgr__artist", children: song.artist.name }), _jsx("td", { children: formatDuration(song.duration) }), _jsxs("td", { children: [_jsx("i", { className: `fa-solid ${playingSong === song.id ? 'fa-pause' : 'fa-play'}`, onClick: () => handlePlayClick(song) }), _jsx("audio", { ref: (el) => { audioRefs.current[song.id] = el; }, hidden: true, children: _jsx("source", { src: song.preview, type: "audio/mp3" }) })] }), _jsx("td", { children: _jsx("input", { type: "checkbox", checked: selectedSongs.some((s) => s.id === song.id), onChange: (e) => handleCheckboxChange(song, e.target.checked) }) })] }, song.id))) })] })) : (_jsx("p", { children: "No results found." })) }));
};
export default TrackListManager;

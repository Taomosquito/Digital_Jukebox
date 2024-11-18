import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useApplication } from '../hooks/useApplicationData';
const TrackListManager = ({ rawResults, onSelectedSongsChange }) => {
    const [selectedSongs, setSelectedSongs] = useState([]); // Local state for selected songs
    // Function to handle song selection/deselection
    const handleCheckboxChange = (song, isChecked) => {
        setSelectedSongs((prev) => {
            const updatedSelection = isChecked
                ? [...prev, song] // Add song if checked
                : prev.filter((s) => s.id !== song.id); // Remove song if unchecked
            // Notify the parent component with the updated list of selected songs
            onSelectedSongsChange(updatedSelection); // Pass updated list to parent (SearchModal)
            return updatedSelection;
        });
    };
    const { audioRefs, playingSong, handlePlayClick, formatDuration } = useApplication();
    useEffect(() => {
        // Send the current selected songs list to the parent component
        onSelectedSongsChange(selectedSongs);
    }, [selectedSongs, onSelectedSongsChange]);
    // Organize the raw results (e.g., sorting by song title)
    const organizeResults = (results) => {
        return results.sort((a, b) => a.title.localeCompare(b.title));
    };
    const organizedResults = organizeResults(rawResults); // Organize the raw data
    return (_jsx("div", { children: organizedResults.length > 0 ? (_jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Album" }), _jsx("th", { children: "Track" }), _jsx("th", { children: "Artist" }), _jsx("th", { children: "Time" }), _jsx("th", { children: "Preview" }), _jsx("th", { children: "Add to Playlist" })] }) }), _jsx("tbody", { children: organizedResults.map((song) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("img", { src: song.album.cover, alt: song.title, width: "50", height: "50" }) }), _jsx("td", { children: song.title }), _jsx("td", { children: song.artist.name }), _jsx("td", { children: formatDuration(song.duration) }), _jsxs("td", { children: [" ", _jsx("i", { className: `fa-solid ${playingSong === song.id ? 'fa-pause' : 'fa-play'}`, onClick: () => handlePlayClick(song) }), _jsx("audio", { ref: (el) => { audioRefs.current[song.id] = el; }, hidden: true, children: _jsx("source", { src: song.preview, type: "audio/mp3" }) })] }), _jsx("td", { children: _jsx("input", { type: "checkbox", checked: selectedSongs.some((s) => s.id === song.id), onChange: (e) => handleCheckboxChange(song, e.target.checked) }) })] }, song.id))) })] })) : (_jsx("p", { children: "No results found." })) }));
};
export default TrackListManager;

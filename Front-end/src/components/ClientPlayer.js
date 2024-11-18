import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
const ClientPlayer = ({ rawResults, onSelectedSongsChange }) => {
    // Organize the raw results (e.g., sorting by song title)
    const organizeResults = (results) => {
        return results.sort((a, b) => a.title.localeCompare(b.title)); // Sort by title
    };
    const organizedResults = organizeResults(rawResults); //a, b, c
    // Track play state per song
    const [playingSong, setPlayingSong] = useState(null); // Store ID of the currently playing song
    const audioRefs = useRef({}); // Store refs for each audio element
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
    const handlePlayClick = (song) => {
        if (audioRefs.current[song.id]) {
            if (playingSong === song.id) {
                // If the clicked song is already playing, pause it
                audioRefs.current[song.id]?.pause();
                setPlayingSong(null); // Reset the playing song state
            }
            else {
                // Pause the currently playing song
                if (playingSong !== null && audioRefs.current[playingSong]) {
                    audioRefs.current[playingSong]?.pause();
                }
                // Play the new song
                audioRefs.current[song.id]?.play();
                setPlayingSong(song.id); // Update the currently playing song state
            }
        }
    };
    return (_jsx("div", { children: organizedResults.length > 0 ? (_jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Album" }), _jsx("th", { children: "Track" }), _jsx("th", { children: "Artist" }), _jsx("th", { children: "Time" }), _jsx("th", { children: "Preview" }), _jsx("th", { children: "Add to Playlist" })] }) }), _jsx("tbody", { children: organizedResults.map((song) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("img", { src: song.album.cover, alt: song.title, width: "50", height: "50" }) }), _jsx("td", { children: song.title }), _jsx("td", { children: song.artist.name }), _jsx("td", { children: formatDuration(song.duration) }), _jsxs("td", { children: [_jsx("i", { className: `fa-solid ${playingSong === song.id ? 'fa-pause' : 'fa-play'}`, onClick: () => handlePlayClick(song) }), _jsx("audio", { ref: (el) => { audioRefs.current[song.id] = el; }, hidden: true, children: _jsx("source", { src: song.preview, type: "audio/mp3" }) })] }), _jsx("td", { children: _jsx("input", { type: "checkbox", checked: selectedSongs.some((s) => s.id === song.id), onChange: (e) => handleCheckboxChange(song, e.target.checked) }) })] }, song.id))) })] })) : (_jsx("p", { children: "No results found." })) }));
};
export default ClientPlayer;

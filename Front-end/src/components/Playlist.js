import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useApplication } from '../hooks/useApplicationData';
import axios from 'axios';
import '../styles/Playlist.scss';
const PlayList = ({ isOpen, onClose }) => {
    const [songs, setSongs] = useState([]);
    const { formatDuration } = useApplication();
    // Fetch songs from backend
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get('http://localhost:3000/songs');
                const data = response.data;
                console.log("Playlist fetchSongs - data: ", data);
                if (Array.isArray(data)) {
                    setSongs(data); // Update the state with the song data
                }
                else {
                    console.error("Expected an array of songs but got:", data);
                }
            }
            catch (error) {
                console.error('Error fetching songs:', error);
            }
        };
        fetchSongs();
    }, []);
    const handleLikeClick = async (songApiId) => {
        try {
            const response = await axios.patch(`http://localhost:3000/songs/${songApiId}/like`);
            const updatedSong = response.data;
            console.log("Playlist updatedSong: ", updatedSong);
            // Update the song list with the updated song's data
            setSongs((prevSongs) => prevSongs.map((song) => song.song_api_id === updatedSong.song_api_id ? { ...song, likes: updatedSong.likes, ...updatedSong } : song));
            window.location.reload(); //Testing: to reload the page
        }
        catch (error) {
            console.error("Error updating likes:", error);
        }
    };
    // Debugging: Songs data
    console.log("Songs array:", songs);
    //Loading indicator for when songs are being fetched or if database is empty
    if (songs.length === 0) {
        return (_jsx("div", { className: "playlist__empty-alert", children: _jsx("h2", { children: "Loading..." }) }));
    }
    return (_jsx(_Fragment, { children: _jsx("div", { className: "playlist__modal-overlay", onClick: onClose, children: _jsx("div", { className: "playlist__modal-content", onClick: (e) => e.stopPropagation(), children: _jsx("div", { className: "playlist__results", children: _jsx("div", { className: "playlist__list-mgr", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Track" }), _jsx("th", { children: "Artist" }), _jsx("th", { children: "Time" }), _jsx("th", { children: "Album" }), _jsx("th", { children: "Likes" })] }) }), _jsx("tbody", { children: songs.map((song) => {
                                        return (_jsxs("tr", { children: [_jsx("td", { className: "playlist__list-mgr__title", children: song.title }), _jsx("td", { className: "playlist__list-mgr__artist", children: song.artist?.name }), _jsx("td", { children: formatDuration(song.duration) }), _jsx("td", { children: song.album?.title }), _jsxs("td", { children: [_jsx("i", { className: `fa-regular fa-thumbs-up ${song.likes > 0 ? 'liked' : ''}`, onClick: () => handleLikeClick(song.id) }), _jsx("span", { children: song.likes })] })] }, song.id));
                                    }) })] }) }) }) }) }) }));
};
export default PlayList;

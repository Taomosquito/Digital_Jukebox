import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useApplication } from '../hooks/useApplicationData';
import axios from 'axios';
import '../styles/Playlist.scss';
const PlayList = ({ isOpen, onClose }) => {
    const [songs, setSongs] = useState([]);
    const { formatDuration } = useApplication();
    console.log("Playlist here");
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                // fetch data from backend
                const response = await axios.get('http://localhost:3000/songs');
                const data = response.data;
                // console.log("Playlist = ", data);
                // Check if the data is an array before setting the state
                if (Array.isArray(data)) {
                    setSongs(data);
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
    // Helper Function that handle the thumb icon, likes.
    const handleLikeClick = async (songId) => {
        try {
            const response = await axios.patch(`http://localhost:3000/songs/${songId}/like`);
            console.log("PLAYLIST handleLikeClick: ", response);
            const updatedSong = response.data;
            console.log("PLAYLIST. updatedSong new LIKES: ", updatedSong.likes);
            setSongs((prevSongs) => prevSongs.map((song) => song.id === updatedSong.id ? { ...song, likes: updatedSong.likes } : song));
            console.log("PLAYLIST :", setSongs);
            getLike(updatedSong.likes, songId);
        }
        catch (error) {
            console.log("Playlist, Error updating likes: ", error);
        }
    };
    //Testing the likes
    const getLike = (likes, songId) => {
        // connect to backend songs database
        // get the number of likes
        // display the number of likes
        // the number of likes will the reference to update the likes icon color
        // Update the song's likes and change the icon color accordingly
        setSongs((prevSongs) => prevSongs.map((song) => song.id === songId
            ? { ...song, likes } // Update the likes count
            : song));
    };
    return (_jsx(_Fragment, { children: _jsx("div", { className: "playlist__modal-overlay", children: _jsx("div", { className: "playlist__modal-content", onClick: (e) => e.stopPropagation(), children: _jsx("div", { className: "playlist__results", children: _jsx("div", { className: 'playlist__list-mgr', children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Track" }), _jsx("th", { children: "Artist" }), _jsx("th", { children: "Time" }), _jsx("th", { children: "Album" }), _jsx("th", { children: "Likes" }), _jsx("th", { children: "# of Likes" })] }) }), _jsx("tbody", { children: songs.map((song, index) => (_jsxs("tr", { children: [_jsx("td", { className: 'playlist__list-mgr__title', children: song.title }), _jsx("td", { className: 'playlist__list-mgr__artist', children: song.artist.name }), _jsx("td", { children: formatDuration(song.duration) }), _jsx("td", { children: song.album.title }), _jsxs("td", { children: [_jsx("i", { className: `fa-regular fa-thumbs-up ${song.likes > 0 ? 'liked' : ''}`, onClick: () => handleLikeClick(song.id) }), _jsx("span", { children: song.likes })] })] }, index))) })] }) }) }) }) }) }));
};
export default PlayList;

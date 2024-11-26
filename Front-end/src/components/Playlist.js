import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useApplication } from '../hooks/useApplicationData';
import { useWebSocket } from '../context/WebSocketContext';
import axios from 'axios';
import '../styles/Playlist.scss';
const PlayList = ({ isOpen, onClose }) => {
    const [songs, setSongs] = useState([]);
    const [likedSongs, setLikedSongs] = useState(new Set());
    const { formatDuration } = useApplication();
    const socket = useWebSocket();
    // Fetch songs from backend on initial mount
    const fetchSongs = async () => {
        try {
            const response = await axios.get('http://localhost:3000/songs');
            const data = response.data;
            console.log("Playlist fetch songs: ", data);
            if (Array.isArray(data)) {
                setSongs(sortSongsByLikes(data)); // Update the state with the song data sorted by likes
            }
            else {
                console.error("Expected an array of songs but got:", data);
            }
        }
        catch (error) {
            console.error('Error fetching songs:', error);
        }
    };
    useEffect(() => {
        fetchSongs(); // Fetch songs when the component is first mounted
    }, []);
    // WebSocket event listener to update song likes
    useEffect(() => {
        if (socket) {
            socket.on('songLiked', (updatedSong) => {
                setSongs((prevSongs) => {
                    // Update the song in the playlist with new likes
                    const updatedSongs = prevSongs.map((song) => song.song_api_id === updatedSong.song_api_id
                        ? { ...song, likes: updatedSong.likes }
                        : song);
                    // Sort the playlist by likes and creation date
                    return sortSongsByLikes(updatedSongs);
                });
            });
            socket.on('songAdded', (addedSong) => {
                console.log("PLAYLIST socket.on: The addedSong data: ", addedSong);
                setSongs((existingSongs) => [...existingSongs, addedSong]);
            });
        }
    }, [socket]);
    // Utility function to sort songs by likes in descending order
    const sortSongsByLikes = (songs) => {
        return songs.sort((a, b) => {
            if (b.likes !== a.likes) {
                return b.likes - a.likes; // Sort by likes (highest first)
            }
            // If likes are equal, sort by creation date
            return (a.created_at || '').localeCompare(b.created_at || '');
        });
    };
    // Handles the Like icon
    const handleLikeClick = async (id) => {
        try {
            // Send the like to the backend via PATCH request
            const response = await axios.patch(`http://localhost:3000/songs/${id}/like`);
            const updatedSong = response.data;
            console.log("Playlist handleLikeClick - updatedSong: ", updatedSong);
            if (!updatedSong || updatedSong.likes === undefined) {
                console.error("Failed to update song like count on the backend");
                return;
            }
            console.log("Song liked successfully: ", updatedSong);
            // Update the playlist state by modifying the specific song's like count
            setSongs((prevSongs) => {
                // Map over the previous songs, updating the like count for the liked song
                const updatedSongs = prevSongs.map((song) => song.song_api_id === updatedSong.song_api_id
                    ? { ...song, likes: updatedSong.likes }
                    : song);
                return sortSongsByLikes(updatedSongs);
            });
            // Optionally, emit the updated song to notify other clients
            if (socket) {
                socket.emit('songLiked', updatedSong);
            }
        }
        catch (error) {
            console.error('Error updating likes:', error);
        }
    };
    // Check if a song is liked
    const isSongLiked = (songId) => likedSongs.has(songId);
    // Loading state if songs are being fetched or if the playlist is empty
    if (songs.length === 0) {
        return (_jsx("div", { className: "playlist__empty-alert", children: _jsx("h2", { children: "Loading..." }) }));
    }
    return (_jsx(_Fragment, { children: _jsx("div", { className: "playlist__modal-overlay", onClick: onClose, children: _jsx("div", { className: "playlist__modal-content", onClick: (e) => e.stopPropagation(), children: _jsx("div", { className: "playlist__results", children: _jsx("div", { className: "playlist__list-mgr", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Song id" }), _jsx("th", { children: "Track" }), _jsx("th", { children: "Artist" }), _jsx("th", { children: "Time" }), _jsx("th", { children: "Album" }), _jsx("th", { children: "Likes" })] }) }), _jsx("tbody", { children: songs.map((song) => (_jsxs("tr", { children: [_jsx("td", { children: song.id }), _jsx("td", { className: "playlist__list-mgr__title", children: song.title }), _jsx("td", { className: "playlist__list-mgr__artist", children: song.artist.name }), _jsx("td", { children: formatDuration(song.duration) }), _jsx("td", { children: song.album.title }), _jsxs("td", { children: [_jsx("i", { className: `fa-regular fa-thumbs-up ${isSongLiked(song.id) ? 'liked' : ''}`, onClick: () => handleLikeClick(song.id) }), _jsx("span", { children: song.likes })] })] }, song.id))) })] }) }) }) }) }) }));
};
export default PlayList;

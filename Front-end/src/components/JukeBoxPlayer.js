import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useApplication } from '../hooks/useApplicationData';
import { useWebSocket } from '../context/WebSocketContext';
import axios from 'axios';
import '../styles/JukeBoxPlayer.scss';
const JukeBoxPlayer = () => {
    const [songs, setSongs] = useState([]);
    const [nowPlaying, setNowPlaying] = useState(null);
    const [nextSong, setNextSong] = useState(null);
    const { formatDuration } = useApplication();
    const socket = useWebSocket();
    // Fetch songs from server initially
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get("/back-end/songs", { headers: { 'Accept': 'application/json' } });
                const data = response.data;
                if (Array.isArray(data)) {
                    const sortedSongs = sortSongsByLikes(data);
                    setSongs(sortedSongs);
                    updateNowPlayingNext(sortedSongs);
                }
            }
            catch (error) {
                console.error('Error fetching songs:', error);
            }
        };
        fetchSongs();
    }, []);
    // WebSocket listeners for song updates
    useEffect(() => {
        if (socket) {
            console.log('WebSocket connected');
            // Handle song liked event
            socket.on('songLiked', (updatedSong) => {
                console.log('Received songLiked event:', updatedSong);
                setSongs((prevSongs) => {
                    const updatedSongs = prevSongs.map((song) => song.song_api_id === updatedSong.song_api_id
                        ? { ...song, likes: updatedSong.likes }
                        : song);
                    const sortedSongs = sortSongsByLikes(updatedSongs);
                    updateNowPlayingNext(sortedSongs);
                    return sortedSongs;
                });
            });
            // Handle song added event (prevents duplicates)
            socket.on('songAdded', (addedSong) => {
                console.log('Received songAdded event:', addedSong);
                setSongs((prevSongs) => {
                    const newSongs = prevSongs.some((song) => song.song_api_id === addedSong.song_api_id)
                        ? prevSongs
                        : sortSongsByLikes([...prevSongs, addedSong]);
                    updateNowPlayingNext(newSongs);
                    return newSongs;
                });
            });
            // Handle playlist song event (prevents duplicates)
            socket.on('playlistSong', (songs) => {
                console.log("Received all songs from database: ", songs);
                const newSongs = songs.filter((song, index, self) => index === self.findIndex((t) => t.song_api_id === song.song_api_id));
                const sortedSongs = sortSongsByLikes(newSongs);
                setSongs(sortedSongs);
                updateNowPlayingNext(sortedSongs);
            });
            // Listen for song deletion events
            socket.on('songDeleted', (data) => {
                console.log(data.message);
                setSongs((prevSongs) => {
                    const updatedSongs = prevSongs.filter((song) => song.id !== data.id);
                    updateNowPlayingNext(updatedSongs);
                    return updatedSongs;
                });
            });
            // Listen for the songsDeleted event (all songs deleted)
            socket.on('songsDeleted', (data) => {
                console.log(data.message); // Log message for debugging
                setSongs([]); // Clear the playlist
                setNowPlaying(null); // Reset nowPlaying
                setNextSong(null); // Reset nextSong
            });
        }
        else {
            console.error('WebSocket not connected');
        }
    }, [socket]);
    // Sort songs by likes, then creation time
    const sortSongsByLikes = (songs) => {
        return songs.sort((a, b) => {
            if (b.likes !== a.likes) {
                return b.likes - a.likes;
            }
            return (a.created_at || '').localeCompare(b.created_at || '');
        });
    };
    // Update Now Playing and Next Song after playlist update
    const updateNowPlayingNext = (sortedSongs) => {
        if (sortedSongs.length > 0) {
            setNowPlaying(sortedSongs[0]);
            setNextSong(sortedSongs[1] || null);
        }
        else {
            setNowPlaying(null);
            setNextSong(null);
        }
    };
    const handleSongEnd = async () => {
        if (nowPlaying) {
            try {
                // Send the delete request to the server
                await axios.delete(`/back-end/songs/${nowPlaying.id}`);
                console.log(`Song ${nowPlaying.title} removed from database`);
                // Emit the 'songDeleted' event to notify the server and other clients
                socket?.emit('songDeleted', { id: nowPlaying.id, message: `Song ${nowPlaying.title} has been deleted` });
            }
            catch (error) {
                console.error('Error deleting song from database:', error);
            }
        }
    };
    return (_jsx("div", { className: "juke-box-player", children: _jsxs("div", { className: "juke-box-player__content", children: [_jsx("h3", { children: "Now Playing" }), nowPlaying ? (_jsx("div", { className: "juke-box-player__now-playing", children: _jsxs("div", { className: "juke-box-player__now-playing__content", children: [_jsx("img", { src: nowPlaying.album.cover, alt: nowPlaying.album.title, width: "100", height: "100" }), _jsxs("div", { className: 'juke-box-player__now-playing__song-details', children: [_jsxs("strong", { children: [nowPlaying.title, " ", _jsx("i", { className: "fas fa-heart" })] }), nowPlaying.artist?.name, _jsx("div", { className: 'juke-box-player__now-playing__song-play', children: _jsx("audio", { src: nowPlaying.preview, 
                                            // autoPlay
                                            controls: true, controlsList: "nodownload noplaybackrate", onEnded: handleSongEnd, className: "juke-box-player__now-playing__audio" }) })] })] }) })) : (_jsx("p", { children: "No song currently playing" })), _jsx("h3", { children: "Next in the Playlist" }), nextSong ? (_jsxs("div", { className: "juke-box-player__next-song", children: [_jsxs("div", { className: "juke-box-player__next-song__content", children: [_jsxs("strong", { children: [nextSong.title, " ", _jsx("i", { className: "fas fa-heart" })] }), _jsxs("span", { children: ["by:  ", nextSong.artist?.name] }), "Album Title:  ", nextSong.album.title] }), _jsx("div", { className: "juke-box-player__next-song__image", children: _jsx("img", { src: nextSong.album.cover, alt: nextSong.album.title, width: "100", height: "100" }) })] })) : (_jsx("p", { children: "No upcoming songs" })), _jsx("h3", { children: "Current Playlist" }), _jsx("div", { className: "juke-box-player__current-playlist", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "#" }), _jsx("th", { children: "Album" }), _jsx("th", { children: "Track" }), _jsx("th", { children: "Artist" }), _jsx("th", { children: "Time" })] }) }), _jsx("tbody", { children: songs.map((song, index) => (_jsxs("tr", { children: [_jsx("td", { children: (index + 1).toString().padStart(3, '0') }), _jsx("td", { children: song.album?.title }), _jsx("td", { children: song.title }), _jsx("td", { children: song.artist?.name }), _jsx("td", { children: formatDuration(song.duration) })] }, song.id))) })] }) })] }) }));
};
export default JukeBoxPlayer;

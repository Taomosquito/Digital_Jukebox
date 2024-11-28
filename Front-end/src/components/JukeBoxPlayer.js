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
    // Fetch playlist songs
    const fetchSongs = async () => {
        try {
            const response = await axios.get('http://localhost:3000/songs');
            const data = response.data;
            if (Array.isArray(data)) {
                console.log('Fetched songs:', data);
                setSongs(sortSongsByLikes(data));
                setNowPlaying(data[0] || null);
                setNextSong(data[1] || null);
            }
        }
        catch (error) {
            console.error('Error fetching songs:', error);
        }
    };
    useEffect(() => {
        fetchSongs(); // Fetch songs on mount
    }, []);
    // WebSocket listeners for song updates
    useEffect(() => {
        if (socket) {
            console.log('WebSocket connected');
            socket.on('songLiked', (updatedSong) => {
                console.log('Received songLiked event:', updatedSong);
                setSongs((prevSongs) => sortSongsByLikes(prevSongs.map((song) => song.song_api_id === updatedSong.song_api_id
                    ? { ...song, likes: updatedSong.likes }
                    : song)));
            });
            socket.on('songAdded', (addedSong) => {
                console.log('Received songAdded event:', addedSong);
                setSongs((prevSongs) => {
                    const newSongs = sortSongsByLikes([...prevSongs, addedSong]);
                    console.log('Updated songs after addition:', newSongs);
                    return newSongs;
                });
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
            return 0;
        });
    };
    return (_jsx("div", { className: "juke-box-player", children: _jsxs("div", { className: "juke-box-player__content", children: [_jsx("h3", { children: "Now Playing" }), nowPlaying ? (_jsx("div", { className: "juke-box-player__now-playing", children: _jsxs("div", { className: "juke-box-player__now-playing__details", children: [_jsx("strong", { children: nowPlaying.title }), _jsx("p", { children: nowPlaying.artist?.name }), _jsx("p", { children: formatDuration(nowPlaying.duration) })] }) })) : (_jsx("p", { children: "No song currently playing" })), _jsx("h3", { children: "Next in the Playlist" }), nextSong ? (_jsxs("div", { className: "juke-box-player__next-song", children: [_jsx("strong", { children: nextSong.title }), " by ", nextSong.artist?.name] })) : (_jsx("p", { children: "No upcoming songs" })), _jsx("h3", { children: "Playlist" }), _jsx("div", { className: "juke-box-player__current-playlist", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Album" }), _jsx("th", { children: "Track" }), _jsx("th", { children: "Artist" }), _jsx("th", { children: "Time" })] }) }), _jsx("tbody", { children: songs.map((song) => (_jsxs("tr", { children: [_jsx("td", { children: song.album?.title }), _jsx("td", { children: song.title }), _jsx("td", { children: song.artist?.name }), _jsx("td", { children: formatDuration(song.duration) })] }, song.id))) })] }) })] }) }));
};
export default JukeBoxPlayer;

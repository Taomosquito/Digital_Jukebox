import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useApplication } from '../hooks/useApplicationData';
import { useWebSocket } from '../context/WebSocketContext';
import axios from 'axios';
import '../styles/JukeBoxPlayer.scss';
const JukeBoxPlayer = () => {
    const [songs, setSongs] = useState([]);
    // const [likedSongs, setLikedSongs] = useState<Set<number>>(new Set());
    const { formatDuration } = useApplication();
    const socket = useWebSocket();
    // Fetch songs from backend on initial mount
    const fetchSongs = async () => {
        try {
            const response = await axios.get('http://localhost:3000/songs');
            const data = response.data;
            console.log("JukeBoxPlayer fetch songs: ", data);
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
        const intervalId = setInterval(fetchSongs, 1000); // Poll every 20 seconds
        return () => {
            clearInterval(intervalId); // Cleanup the interval on component unmount
        };
    }, []);
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
    return (_jsx("div", { className: "juke-box-player", children: _jsxs("div", { className: "juke-box-player__content", children: ["Now Playing", _jsx("div", { className: "juke-box-player__now-playing", children: "(Now Playing Image) (Title) (Artist) (duration)" }), "Next in the Playlist", _jsx("div", { className: "juke-box-player__next-song", children: "Next in the Playlist" }), "Playlist", _jsx("div", { className: "juke-box-player__playlist", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Album" }), _jsx("th", { children: "Track" }), _jsx("th", { children: "Artist" }), _jsx("th", { children: "Time" })] }) }), _jsx("tbody", { children: songs.map((song) => (_jsxs("tr", { children: [_jsx("td", { children: song.album?.title }), _jsx("td", { className: "playlist__list-mgr__title", children: song.title }), _jsx("td", { className: "playlist__list-mgr__artist", children: song.artist?.name }), _jsx("td", { children: formatDuration(song.duration) })] }, song.id))) })] }) })] }) }));
};
export default JukeBoxPlayer;

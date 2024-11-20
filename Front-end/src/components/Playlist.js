import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import React from "react";
// const Playlist = () => {
//   return (
//     <div>
//       <p>In Progress ... </p>
//     </div>
//   );
// }
// export default Playlist;import React, { useEffect, useState } from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
const Playlist = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log("Playlist here");
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                // Use axios to fetch data from your backend
                const response = await axios.get('http://localhost:3000/songs');
                // Axios automatically parses the response data, so no need for .json()
                const data = response.data;
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
    return (_jsxs("div", { className: "playlist", children: [_jsx("h2", { children: "Your Playlist" }), _jsx("div", { className: "song-list", children: songs.map((song, index) => (_jsxs("div", { className: "song-item", children: [_jsx("img", { src: song.album.cover_small, alt: song.title }), _jsx("h3", { children: song.title }), _jsx("p", { children: song.artist.name }), _jsxs("audio", { controls: true, children: [_jsx("source", { src: song.preview, type: "audio/mp3" }), "Your browser does not support the audio element."] })] }, index))) })] }));
};
export default Playlist;

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
    useEffect(() => {
        // Fetch the songs from your backend
        axios.get('/songs')
            .then((response) => {
            setSongs(response.data); // Set the song details
            setLoading(false); // Set loading to false once data is fetched
        })
            .catch((err) => {
            setError('Failed to load songs');
            setLoading(false);
        });
    }, []);
    if (loading) {
        return _jsx("div", { children: "Loading..." });
    }
    if (error) {
        return _jsx("div", { children: error });
    }
    return (_jsxs("div", { className: "playlist", children: [_jsx("h2", { children: "Your Playlist" }), _jsx("div", { className: "song-list", children: songs.map((song, index) => (_jsxs("div", { className: "song-item", children: [_jsx("img", { src: song.album.cover_small, alt: song.title }), _jsx("h3", { children: song.title }), _jsx("p", { children: song.artist.name }), _jsxs("audio", { controls: true, children: [_jsx("source", { src: song.preview, type: "audio/mp3" }), "Your browser does not support the audio element."] })] }, index))) })] }));
};
export default Playlist;

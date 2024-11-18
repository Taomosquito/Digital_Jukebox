import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const Playlist = () => {
    const [isLike, setIsLike] = useState(false);
    // Format the song duration into a readable time format
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };
    // const handleLikes = {
    //   setIsLike(true);
    // }
    return (_jsx("div", { className: "playlist", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Track" }), _jsx("th", { children: "Artist" }), _jsx("th", { children: "Time" }), _jsx("th", { children: "Album" }), _jsx("th", { children: "Likes" })] }) }), _jsx("tbody", { children: _jsxs("tr", { children: [_jsx("td", { children: song.title }), _jsx("td", { children: song.artist.name }), _jsx("td", { children: formatDuration(song.duration) }), _jsx("td", { children: song.album.title }), _jsx("td", { children: _jsx("i", { className: "fa-regular fa-thumbs-up" }) })] }, song.id) })] }) }));
};
export default Playlist;

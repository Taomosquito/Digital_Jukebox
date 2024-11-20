import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import useMusicApi from '../hooks/useMusicApi';
const ClientPlayer = () => {
    const [query, setQuery] = useState("Pearl Jam");
    const [searchQuery, setSearchQuery] = useState(query); // Store the query for search
    // Use the searchQuery to trigger the API call
    const { data, loading, error } = useMusicApi(searchQuery);
    // This function only triggers when the Search button is clicked
    const handleSearchClick = () => {
        setSearchQuery(query);
    };
    //This convert the song duration to time format.
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };
    return (_jsxs("div", { children: [_jsx("input", { type: "text", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search for a song" }), _jsx("button", { onClick: handleSearchClick, children: "Search" }), loading && _jsx("p", { children: "Loading..." }), error && _jsx("p", { children: "Error fetching data" }), data && (_jsxs("div", { children: [_jsxs("h3", { children: ["\"", query, "\"  Result"] }), _jsx("br", {}), _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Album" }), _jsx("th", { children: "Track" }), _jsx("th", { children: "Artist" }), _jsx("th", { children: "Time" }), _jsx("th", { children: "Preview" }), _jsx("th", { children: "Action" })] }) }), _jsx("tbody", { children: data?.data.map((song) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("img", { src: song.album.cover, alt: song.title, width: "50", height: "50" }) }), _jsx("td", { children: song.title }), _jsx("td", { children: song.artist.name }), _jsx("td", { children: formatDuration(song.duration) }), _jsx("td", { children: _jsx("audio", { controls: true, children: _jsx("source", { src: song.preview, type: "audio/mp3" }) }) }), _jsx("td", { children: "\"Add link Pending\"" })] }, song.id))) })] })] }))] }));
};
export default ClientPlayer;

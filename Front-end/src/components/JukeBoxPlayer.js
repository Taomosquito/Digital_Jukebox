import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import React, { useState, useEffect } from 'react';
// import { useApplication } from '../hooks/useApplicationData';
// import { useWebSocket } from '../context/WebSocketContext';
// import axios from 'axios';
// import '../styles/JukeBoxPlayer.scss';
// interface Song {
//   id: number;
//   song_api_id: number;
//   title: string;
//   duration: number;
//   artist: {
//     name: string;
//   };
//   album: {
//     title: string;
//   };
//   likes: number;
//   preview:string;
// }
// const JukeBoxPlayer = () => {
//   const [songs, setSongs] = useState<Song[]>([]);
//   const [nowPlaying, setNowPlaying] = useState<Song | null>(null);
//   const [nextSong, setNextSong] = useState<Song | null>(null);
//   const { formatDuration } = useApplication();
//   const socket = useWebSocket();
//   // Fetch playlist songs
//   useEffect(() => {
//     const fetchSongs = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/songs');
//         const data = response.data;
//         if (Array.isArray(data)) {
//           console.log('Fetched songs:', data);
//           const sortedSongs = sortSongsByLikes(data);
//           setSongs(sortedSongs);
//           if (sortedSongs.length > 0) {
//             setNowPlaying(sortedSongs[0] || null); // set the first song as Now Playing
//             if (sortedSongs.length > 1) {
//               setNextSong(sortedSongs[1] || null); // set next song in the plylist
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Sorry, Error fetching songs:', error);
//       }
//     };
//     fetchSongs(); // Fetch songs on mount
//   }, []);
//   const handleSongEnd = async () => {
//     // Remove the current song from the playlist and database
//     if (nowPlaying) {
//       try {
//         await axios.delete(`http://localhost:3000/songs/${nowPlaying.id}`);
//         console.log(`Song ${nowPlaying.title} removed from database`);
//         // Update the playlist state
//         setSongs((prevSongs) => prevSongs.filter((song) => song.id !== nowPlaying.id));
//         // Set the next song as 'Now Playing'
//         if (songs.length > 1) {
//           setNowPlaying(songs[1]);
//           setNextSong(songs[2] || null); // Set the next song if available
//         } else {
//           setNowPlaying(null); // No more songs left to play
//           setNextSong(null);
//         }
//       } catch (error) {
//         console.error('Error deleting song from database:', error);
//       }
//     }
//   };
//   // WebSocket listeners for song updates
//   useEffect(() => {
//     if (socket) {
//       console.log('WebSocket connected');
//       socket.on('songLiked', (updatedSong: Song) => {
//         console.log('Received songLiked event:', updatedSong);
//         setSongs((prevSongs) =>
//           sortSongsByLikes(
//             prevSongs.map((song) =>
//               song.song_api_id === updatedSong.song_api_id
//                 ? { ...song, likes: updatedSong.likes }
//                 : song
//             )
//           )
//         );
//       });
//       socket.on('songAdded', (addedSong: Song) => {
//         console.log('Received songAdded event:', addedSong);
//         setSongs((prevSongs) => {
//           const newSongs = sortSongsByLikes([...prevSongs, addedSong]);
//           console.log('Updated songs after addition:', newSongs);
//           // Set the new "Now Playing" song if there isn't already one playing
//           if (!nowPlaying) {
//             setNowPlaying(newSongs[0]);
//           }
//           return newSongs;
//         });
//       });
//     } else {
//       console.error('WebSocket not connected');
//     }
//   }, [socket, nowPlaying]);
//   // Sort songs by likes, then creation time
//   const sortSongsByLikes = (songs: Song[]) => {
//     return songs.sort((a, b) => {
//       if (b.likes !== a.likes) {
//         return b.likes - a.likes;
//       }
//       return 0;
//     });
//   };
//   return (
//     <div className="juke-box-player">
//       <div className="juke-box-player__content">
//         <h2>Now Playing</h2>
//         {nowPlaying ? (
//           <div className="juke-box-player__now-playing">
//             <div className="juke-box-player__now-playing__details">
//               <strong>{nowPlaying.title}</strong>
//               <p>{nowPlaying.artist?.name}</p>
//               <p>{formatDuration(nowPlaying.duration)}</p>
//               <audio
//                 src={nowPlaying.preview}
//                 autoPlay
//                 controls
//                 onEnded={handleSongEnd} // Trigger when the song ends
//                 className="juke-box-player__now-playing__audio"
//               >
//               </audio>
//             </div>
//           </div>
//         ) : (
//           <p>No song currently playing</p>
//         )}
//         <h2>Next in the Playlist</h2>
//         {nextSong ? (
//           <div className="juke-box-player__next-song">
//             <strong>{nextSong.title}</strong> by {nextSong.artist?.name}
//           </div>
//         ) : (
//           <p>No upcoming songs</p>
//         )}
//         <h2>Current Playlist</h2>
//         <div className="juke-box-player__current-playlist">
//           <table>
//             <thead>
//               <tr>
//                 <th>Album</th>
//                 <th>Track</th>
//                 <th>Artist</th>
//                 <th>Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {songs.map((song) => (
//                 <tr key={song.id}>
//                   <td>{song.album?.title}</td>
//                   <td>{song.title}</td>
//                   <td>{song.artist?.name}</td>
//                   <td>{formatDuration(song.duration)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default JukeBoxPlayer;
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
    // WebSocket listeners for song updates
    useEffect(() => {
        if (socket) {
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
                    if (!nowPlaying) {
                        setNowPlaying(newSongs[0]);
                        setNextSong(newSongs[1] || null);
                    }
                    return newSongs;
                });
            });
        }
        else {
            console.error('WebSocket not connected');
        }
    }, [socket, nowPlaying]);
    // Sort songs by likes, then creation time
    const sortSongsByLikes = (songs) => {
        return songs.sort((a, b) => {
            if (b.likes !== a.likes) {
                return b.likes - a.likes;
            }
            return 0;
        });
    };
    const handleSongEnd = async () => {
        // Remove the current song from the playlist and database
        if (nowPlaying) {
            try {
                await axios.delete(`http://localhost:3000/songs/${nowPlaying.id}`);
                console.log(`Song ${nowPlaying.title} removed from database`);
                setSongs((prevSongs) => prevSongs.filter((song) => song.id !== nowPlaying.id));
                setNowPlaying(songs[1] || null);
                setNextSong(songs[2] || null);
            }
            catch (error) {
                console.error('Error deleting song from database:', error);
            }
        }
    };
    return (_jsx("div", { className: "juke-box-player", children: _jsxs("div", { className: "juke-box-player__content", children: [_jsx("h2", { children: "Now Playing" }), nowPlaying ? (_jsx("div", { className: "juke-box-player__now-playing", children: _jsxs("div", { className: "juke-box-player__now-playing__details", children: [_jsx("strong", { children: nowPlaying.title }), _jsx("p", { children: nowPlaying.artist?.name }), _jsx("p", { children: formatDuration(nowPlaying.duration) }), _jsx("audio", { src: nowPlaying.preview, autoPlay: true, controls: true, onEnded: handleSongEnd, className: "juke-box-player__now-playing__audio" })] }) })) : (_jsx("p", { children: "No song currently playing" })), _jsx("h2", { children: "Next in the Playlist" }), nextSong ? (_jsxs("div", { className: "juke-box-player__next-song", children: [_jsx("strong", { children: nextSong.title }), " by ", nextSong.artist?.name] })) : (_jsx("p", { children: "No upcoming songs" })), _jsx("h2", { children: "Current Playlist" }), _jsx("div", { className: "juke-box-player__current-playlist", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Album" }), _jsx("th", { children: "Track" }), _jsx("th", { children: "Artist" }), _jsx("th", { children: "Time" })] }) }), _jsx("tbody", { children: songs.map((song) => (_jsxs("tr", { children: [_jsx("td", { children: song.album?.title }), _jsx("td", { children: song.title }), _jsx("td", { children: song.artist?.name }), _jsx("td", { children: formatDuration(song.duration) })] }, song.id))) })] }) })] }) }));
};
export default JukeBoxPlayer;

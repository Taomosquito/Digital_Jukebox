import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// import React, { useEffect, useState } from 'react';
// import { useApplication } from '../hooks/useApplicationData';
// import axios from 'axios';
// import '../styles/Playlist.scss'
// interface Song {
//   id: number;
//   title: string;
//   duration: number;
//   artist: {
//     name: string;
//     picture_small: string;
//   };
//   album: {
//     title: string;
//   };
//   likes: number;
//   created_at: string;
// }
// interface PlayListProps {
//   isOpen: boolean;
//   onClose: () => void;
// }
// const PlayList = ({ isOpen, onClose }: PlayListProps) => {
//   const [songs, setSongs] = useState<Song[]>([]);
//   const { formatDuration } = useApplication();
//   console.log("Playlist here");
//   useEffect(() => {
//     const fetchSongs = async () => {
//       try {
//         // fetch data from backend
//         const response = await axios.get('http://localhost:3000/songs');
//         const data = response.data;
//         // console.log("Playlist = ", data);
//         // Check if the data is an array before setting the state
//         if (Array.isArray(data)) {
//           setSongs(sortSongsByLikes(data)); //sort the data by likes or created_at if in case has the same number of likes.
//         } else {
//           console.error("Expected an array of songs but got:", data);
//         }
//       } catch (error) {
//         console.error('Error fetching songs:', error);
//       }
//     };
//     fetchSongs();
//   }, []);
//   // Helper function to sort songs by likes (highest to lowest)
//   const sortSongsByLikes = (songs: Song[]) => {
//     // Sort by likes, created_at in descending order
//     return [...songs].sort((a, b) => {
//       if (b.likes === a.likes) {
//         // If likes are equal, sort by created_at (newer songs first)
//         return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
//       }
//       return b.likes - a.likes;
//     });
//   };
//   // Helper Function that handle the thumb icon, likes.
//   // const handleLikeClick = async (songId: number) => {
//   //   try {
//   //     const response = await axios.patch(`http://localhost:3000/songs/${songId}/like`);
//   //     console.log("PLAYLIST handleLikeClick: ", response);
//   //     const updatedSong = response.data;
//   //     console.log("PLAYLIST. updatedSong new LIKES: ", updatedSong.likes);
//   //     setSongs((prevSongs) => {
//   //       return prevSongs.map((song) =>
//   //         song.id === updatedSong.id ? { ...song, likes: updatedSong.likes } : song
//   //       );
//   //     });
//   //     getLike(updatedSong.likes, songId);
//   //   }
//   //   catch(error) {
//   //     console.log("Playlist, Error updating likes: ", error);
//   //   }
//   // };
//   //Testing the likes
//   const getLike = (likes: number, songId: number) => {
//     // connect to backend songs database
//     // get the number of likes
//     // display the number of likes
//     // the number of likes will the reference to update the likes icon color
//     // Update the song's likes and change the icon color accordingly
//     setSongs((prevSongs) =>
//       prevSongs.map((song) =>
//         song.id === songId
//           ? { ...song, likes } // Update the likes count
//           : song
//       )
//     );
//   };
//   return (
//     <>
//       {/* <h3>Playlist</h3>   */}
//       <div className="playlist__modal-overlay">
//         <div className="playlist__modal-content" onClick={(e) => e.stopPropagation()}>
//           <div className="playlist__results">
//           <div className='playlist__list-mgr'>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Track</th>
//                   <th>Artist</th>
//                   <th>Time</th>
//                   <th>Album</th>
//                   <th>Likes</th>
//                   <th># of Likes</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {songs.map((song, index) => (
//                   <tr key={index}>
//                     <td className='playlist__list-mgr__title'>{song.title}</td>
//                     <td className='playlist__list-mgr__artist'>{song.artist.name}</td>
//                     <td>{formatDuration(song.duration)}</td>
//                     <td>{song.album.title}</td>
//                     <td>
//                         <i
//                           className={`fa-regular fa-thumbs-up ${song.likes > 0 ? 'liked' : ''}`}
//                           onClick={() => handleLikeClick(song.id)}
//                         ></i>
//                         <span>{song.likes}</span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
// export default PlayList;
import { useEffect, useState } from 'react';
import { useApplication } from '../hooks/useApplicationData';
import axios from 'axios';
import '../styles/Playlist.scss';
const PlayList = ({ isOpen, onClose }) => {
    const [songs, setSongs] = useState([]);
    const { formatDuration } = useApplication();
    // Fetch songs from backend
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get('http://localhost:3000/songs');
                const data = response.data;
                console.log("data: ", data);
                if (Array.isArray(data)) {
                    setSongs(data); // Update the state with the song data
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
    const handleLikeClick = async (songApiId) => {
        try {
            const response = await axios.patch(`http://localhost:3000/songs/${songApiId}/like`);
            const updatedSong = response.data;
            console.log("Playlist updatedSong: ", updatedSong);
            // Update the song list with the updated song's data
            setSongs((prevSongs) => prevSongs.map((song) => song.song_api_id === updatedSong.song_api_id ? { ...song, likes: updatedSong.likes, ...updatedSong } : song));
            window.location.reload(); //Testing: to reload the page
        }
        catch (error) {
            console.error("Error updating likes:", error);
        }
    };
    // Debugging: Songs data
    console.log("Songs array:", songs);
    // Loading indicator for when songs are being fetched
    if (songs.length === 0) {
        return (_jsxs("div", { className: "playlist__empty-alert", children: [_jsx("h2", { children: "No songs have been selected for playback." }), _jsx("h4", { children: "Please navigate to the search section to browse, select, and add songs to our playlist " })] }));
    }
    return (_jsx(_Fragment, { children: _jsx("div", { className: "playlist__modal-overlay", onClick: onClose, children: _jsx("div", { className: "playlist__modal-content", onClick: (e) => e.stopPropagation(), children: _jsx("div", { className: "playlist__results", children: _jsx("div", { className: "playlist__list-mgr", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Song API id" }), _jsx("th", { children: "Track" }), _jsx("th", { children: "Artist" }), _jsx("th", { children: "Time" }), _jsx("th", { children: "Album" }), _jsx("th", { children: "Likes" })] }) }), _jsx("tbody", { children: songs.map((song) => {
                                        // Ensure no extra whitespace or newline characters inside the <tr>
                                        return (_jsxs("tr", { children: [_jsx("td", { children: song.id }), _jsx("td", { className: "playlist__list-mgr__title", children: song.title }), _jsx("td", { className: "playlist__list-mgr__artist", children: song.artist?.name }), _jsx("td", { children: formatDuration(song.duration) }), _jsx("td", { children: song.album?.title }), _jsxs("td", { children: [_jsx("i", { className: `fa-regular fa-thumbs-up ${song.likes > 0 ? 'liked' : ''}`, onClick: () => handleLikeClick(song.id) }), _jsx("span", { children: song.likes })] })] }, song.id));
                                    }) })] }) }) }) }) }) }));
};
export default PlayList;

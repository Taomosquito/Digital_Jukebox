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


import React, { useState, useEffect } from 'react';
import { useApplication } from '../hooks/useApplicationData';
import { useWebSocket } from '../context/WebSocketContext';
import axios from 'axios';
import '../styles/JukeBoxPlayer.scss';

interface Song {
  id: number;
  song_api_id: number;
  title: string;
  duration: number;
  artist: {
    name: string;
  };
  album: {
    title: string;
  };
  likes: number;
  preview: string;
}

const JukeBoxPlayer = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Song | null>(null);
  const [nextSong, setNextSong] = useState<Song | null>(null);
  const { formatDuration } = useApplication();
  const socket = useWebSocket();

  // WebSocket listeners for song updates
  useEffect(() => {
    if (socket) {
      socket.on('songLiked', (updatedSong: Song) => {
        console.log('Received songLiked event:', updatedSong);
        setSongs((prevSongs) =>
          sortSongsByLikes(
            prevSongs.map((song) =>
              song.song_api_id === updatedSong.song_api_id
                ? { ...song, likes: updatedSong.likes }
                : song
            )
          )
        );
      });

      socket.on('songAdded', (addedSong: Song) => {
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

      socket.on('playlistSong', (currentSong: Song[]) => {
        console.log("Received all songs from database: ", currentSong);
        const allSongs = sortSongsByLikes(currentSong);
        setSongs(allSongs);
        if (allSongs.length > 0) {
          setNowPlaying(allSongs[0]);
          setNextSong(allSongs[1] || null);
        }
      });
    } else {
      console.error('WebSocket not connected');
    }
  }, [socket, nowPlaying]);

  // Sort songs by likes, then creation time
  const sortSongsByLikes = (songs: Song[]) => {
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
      } catch (error) {
        console.error('Error deleting song from database:', error);
      }
    }
  };

  return (
    <div className="juke-box-player">
      <div className="juke-box-player__content">
        <h2>Now Playing</h2>
        {nowPlaying ? (
          <div className="juke-box-player__now-playing">
            <div className="juke-box-player__now-playing__details">
              <strong>{nowPlaying.title}</strong>
              <p>{nowPlaying.artist?.name}</p>
              <p>{formatDuration(nowPlaying.duration)}</p>
              <audio
                src={nowPlaying.preview}
                autoPlay
                controls
                onEnded={handleSongEnd} //Trigger when song ended
                className="juke-box-player__now-playing__audio"
              ></audio>
            </div>
          </div>
        ) : (
          <p>No song currently playing</p>
        )}

        <h2>Next in the Playlist</h2>
        {nextSong ? (
          <div className="juke-box-player__next-song">
            <strong>{nextSong.title}</strong> by {nextSong.artist?.name}
          </div>
        ) : (
          <p>No upcoming songs</p>
        )}

        <h2>Current Playlist</h2>
        <div className="juke-box-player__current-playlist">
          <table>
            <thead>
              <tr>
                <th>Album</th>
                <th>Track</th>
                <th>Artist</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => (
                <tr key={song.id}>
                  <td>{song.album?.title}</td>
                  <td>{song.title}</td>
                  <td>{song.artist?.name}</td>
                  <td>{formatDuration(song.duration)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JukeBoxPlayer;

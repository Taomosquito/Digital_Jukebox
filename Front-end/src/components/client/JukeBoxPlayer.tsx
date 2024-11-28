import React, {useState, useEffect}from "react";
import Playlist from '../Playlist';
import "../../styles/JukeBoxPlayer.scss";
import { useApplication } from '../../hooks/useApplicationData';
import { useWebSocket } from '../../context/WebSocketContext';
import axios from 'axios'

interface Song {
  id: number;
  song_api_id: number;
  title: string;
  duration: number;
  artist: {
    name: string;
    picture_small: string;
  };
  album: {
    title: string;
  };
  likes: number;
  created_at: string;
}

const JukeBoxPlayer = () => {

  const [songs, setSongs] = useState<Song[]>([]);
  // const [likedSongs, setLikedSongs] = useState<Set<number>>(new Set());
  const { formatDuration } = useApplication();
  const socket = useWebSocket();
  

  // Fetch songs from backend on initial mount
  const fetchSongs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/songs');
      const data = response.data;
      console.log("Playlist fetch songs: ", data)
      if (Array.isArray(data)) {
        setSongs(sortSongsByLikes(data)); // Update the state with the song data sorted by likes
      } else {
        console.error("Expected an array of songs but got:", data);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  useEffect(() => {
    fetchSongs(); // Fetch songs when the component is first mounted
  }, []);

   // Utility function to sort songs by likes in descending order
   const sortSongsByLikes = (songs: Song[]) => {
    return songs.sort((a, b) => {
      if (b.likes !== a.likes) {
        return b.likes - a.likes; // Sort by likes (highest first)
      }
      // If likes are equal, sort by creation date
      return (a.created_at || '').localeCompare(b.created_at || '');
    });
  };
  
  return (
    <div className="juke-box-player">
      <div className="juke-box-player__content">
        Now Playing
        <div className="juke-box-player__now-playing">
          (Now Playing Image)
          (Title)
          (Artist)      
          (duration)
        </div>
        Next in the Playlist
        <div className="juke-box-player__next-song">
          Next in the Playlist
        </div>
        Playlist
        <div className="juke-box-player__playlist">
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
                  {/* <td>{song.id}</td> */}
                  <td>{song.album?.title}</td>
                  <td className="playlist__list-mgr__title">{song.title}</td>
                  <td className="playlist__list-mgr__artist">{song.artist?.name}</td>
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
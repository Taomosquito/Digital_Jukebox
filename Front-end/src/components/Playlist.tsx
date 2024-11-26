import React, { useEffect, useState } from 'react';
import { useApplication } from '../hooks/useApplicationData';
import { useWebSocket } from '../context/WebSocketContext';
import axios from 'axios';
import '../styles/Playlist.scss';

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

interface PlayListProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlayList = ({ isOpen, onClose }: PlayListProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [likedSongs, setLikedSongs] = useState<Set<number>>(new Set());
  const { formatDuration } = useApplication();
  const socket = useWebSocket();

  // Fetch songs from backend on initial mount
  const fetchSongs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/songs');
      const data = response.data;
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

  // WebSocket event listener to update song likes
  useEffect(() => {
    if (socket) {
      socket.on('songLiked', (updatedSong: Song) => {
        setSongs((prevSongs) => {
          // Update the song in the playlist with new likes
          const updatedSongs = prevSongs.map((song) => 
            song.song_api_id === updatedSong.song_api_id
              ? { ...song, likes: updatedSong.likes }
              : song
          );
          
          // Sort the playlist by likes and creation date
          return sortSongsByLikes(updatedSongs);
        });
      });

      socket.on('songAdded', (addedSong: Song) => {
        console.log("PLAYLIST socket.on: The addedSong data: ", addedSong);
        setSongs((existingSongs) => [...existingSongs, addedSong])
      })
    }
  }, [socket]);

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

  const handleLikeClick = async (songApiId: number) => {
    try {
      // Send the like to the backend via PATCH request
      const response = await axios.patch(`http://localhost:3000/songs/${songApiId}/like`);
      const updatedSong = response.data;

      // Ensure the backend has successfully updated the song's like count before reflecting the change
      
      if (updatedSong.likes !== undefined) {
        // Update the liked songs state
        setLikedSongs((prev) => {
          const newLikedSongs = new Set(prev);
          newLikedSongs.add(songApiId);
          return newLikedSongs;
        });

        // Locally update the playlist state and sort it by likes
        setSongs((prevSongs) => {
          const updatedSongs = prevSongs.map((song) =>
            song.song_api_id === updatedSong.song_api_id
              ? { ...song, likes: updatedSong.likes }
              : song
          );
          return sortSongsByLikes(updatedSongs); // Re-sort the list after updating
        });

        // Emit the updated song to the WebSocket server to notify other clients
        if (socket) {
          socket.emit('songLiked', updatedSong);
        }
      } else {
        console.error("Failed to update song like count on the backend");
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  // Check if a song is liked
  const isSongLiked = (songApiId: number) => likedSongs.has(songApiId);

  // Loading state if songs are being fetched or if the playlist is empty
  if (songs.length === 0) {
    return (
      <div className="playlist__empty-alert">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <div className="playlist__modal-overlay" onClick={onClose}>
        <div className="playlist__modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="playlist__results">
            <div className="playlist__list-mgr">
              <table>
                <thead>
                  <tr>
                    <th>Track</th>
                    <th>Artist</th>
                    <th>Time</th>
                    <th>Album</th>
                    <th>Likes</th>
                  </tr>
                </thead>
                <tbody>
                  {songs.map((song) => (
                    <tr key={song.id}>
                      <td className="playlist__list-mgr__title">{song.title}</td>
                      <td className="playlist__list-mgr__artist">{song.artist?.name}</td>
                      <td>{formatDuration(song.duration)}</td>
                      <td>{song.album?.title}</td>
                      <td>
                        <i
                          className={`fa-regular fa-thumbs-up ${isSongLiked(song.id) ? 'liked' : ''}`}
                          onClick={() => handleLikeClick(song.song_api_id)} // Pass song_api_id for backend interaction
                        ></i>
                        <span>{song.likes}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayList;

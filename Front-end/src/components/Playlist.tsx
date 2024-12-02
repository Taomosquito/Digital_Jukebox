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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { formatDuration } = useApplication();
  const socket = useWebSocket();

  // //Fetch songs from backend on initial mount
  const fetchSongs = async () => {
    try {
      const response = await axios.get("/back-end/songs", { headers: { 'Accept': 'application/json' }});
      
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

  // WebSocket event listener to update song likes
  useEffect(() => {
    if (socket) {

      socket.on('playlistSong', (songs: Song[]) => {
        console.log("Received all songs from database: ", songs);
        const allSongs = sortSongsByLikes(songs);
        setSongs(allSongs);
        setIsLoading(false);  // Mark as done loading
      });

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
      });

      // Listen for the songsDeleted event
      socket.on('songsDeleted', (data) => {
        console.log(data.message); // Log message for debugging
        setSongs([]);
        setIsLoading(true);
      });

      // Listen for songDeleted event
      socket.on('songDeleted', (data) => {
        console.log('PLAYLIST socket.on: Received songDeleted event:', data.message);

        // Update the state to remove the deleted song from the playlist
        setSongs((existingSongs) => existingSongs.filter(song => song.id !== data.id));
      });
    }
    // Cleanup on component unmount
    return () => {
      if (socket) {
        socket.off('playlistSong');
        socket.off('error');
      }
    };
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
    
  // Check if a song is liked
  const isSongLiked = (songId: number) => likedSongs.has(songId);
  
  // Handles the Like icon
  const handleLikeClick = async (id: number) => {
    try {

      // *Check if the song is currently liked or not
      const isLiked = isSongLiked(id);

      // Send the like to the backend via PATCH request
      const response = await axios.patch(`/back-end/songs/${id}/like`, {
        action: isLiked ? 'unlike' : 'like', //*Send 'unlike' if already liked, 'like' if not liked
      });
      const updatedSong = response.data;

      console.log("Playlist handleLikeClick - updatedSong: ", updatedSong);
  
      if (!updatedSong || updatedSong.likes === undefined) {
        console.error("Failed to update song like count on the backend");
        return;
      }
  
      console.log("Song liked successfully: ", updatedSong);

      // Update the likedSongs state to toggle the song's liked status
      setLikedSongs((prevLikedSongs) => {
        const newLikedSongs = new Set(prevLikedSongs);
        if (isLiked) {
          newLikedSongs.delete(id); // Remove the song ID if unliked
        } else {
          newLikedSongs.add(id); // Add the song ID if liked
        }
        return newLikedSongs;
      });

  
      // Update the playlist state by modifying the specific song's like count
      setSongs((prevSongs) => {
        // Map over the previous songs, updating the like count for the liked song
        const updatedSongs = prevSongs.map((song) =>
          song.song_api_id === updatedSong.song_api_id
            ? { ...song, likes: updatedSong.likes }
            : song
        );

        return sortSongsByLikes(updatedSongs);
      });
  
      // emit the updated song to notify other clients
      if (socket) {
        socket.emit('songLiked', updatedSong);
      }
  
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const currentPlayList = songs.length === 0;

  return (
    <>
      <div className="playlist__modal-overlay" onClick={onClose}>
        <div className="playlist__modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="playlist__results">
            <div className="playlist__list-mgr">
              {currentPlayList ? (
                <div className="playlist__empty-alert">
                  <h2>Loading...</h2>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Album</th>
                      <th>Track</th>
                      <th>Artist</th>
                      <th>Time</th>
                      <th>Likes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {songs.map((song, index) => (
                      <tr key={song.id}>
                        <td>{(index + 1).toString().padStart(3, '0')}</td>
                        <td>{song.album?.title}</td>
                        <td className="playlist__list-mgr__title">{song.title}</td>
                        <td className="playlist__list-mgr__artist">{song.artist?.name}</td>
                        <td>{formatDuration(song.duration)}</td>
                        <td>
                          <i
                            className={`fa-regular fa-thumbs-up ${isSongLiked(song.id) ? 'liked' : ''}`}
                            onClick={() => handleLikeClick(song.id)}
                          ></i>
                          <span>{song.likes}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
};

export default PlayList;

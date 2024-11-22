import React, { useEffect, useState } from 'react';
import { useApplication } from '../hooks/useApplicationData';
import axios from 'axios';
import '../styles/Playlist.scss';

interface Song {
  id: number;
  song_api_id: string;
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
  const { formatDuration } = useApplication();

  // Fetch songs from backend
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/songs');
        const data = response.data;
        console.log("Playlist fetchSongs - data: ", data)
        if (Array.isArray(data)) {
          setSongs(data); // Update the state with the song data
        } else {
          console.error("Expected an array of songs but got:", data);
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    fetchSongs();
  }, []);

  const handleLikeClick = async (songApiId: number) => {
    try {
      const response = await axios.patch(`http://localhost:3000/songs/${songApiId}/like`);
      const updatedSong = response.data;

      console.log("Playlist updatedSong: ", updatedSong);
  
      // Update the song list with the updated song's data
      setSongs((prevSongs) =>
        prevSongs.map((song) =>
          song.song_api_id === updatedSong.song_api_id ? { ...song, likes: updatedSong.likes, ...updatedSong } : song
        )
      );
      window.location.reload(); //Testing: to reload the page
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  // Debugging: Songs data
  console.log("Songs array:", songs);

  //Loading indicator for when songs are being fetched or if database is empty
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
                    <th>Song API id</th>
                    <th>Track</th>
                    <th>Artist</th>
                    <th>Time</th>
                    <th>Album</th>
                    <th>Likes</th>
                  </tr>
                </thead>
                <tbody>
                  {songs.map((song) => {
                    return (
                      <tr key={song.id}>
                        <td>{song.id}</td>
                        <td className="playlist__list-mgr__title">{song.title}</td>
                        <td className="playlist__list-mgr__artist">{song.artist?.name}</td>
                        <td>{formatDuration(song.duration)}</td>
                        <td>{song.album?.title}</td>
                        <td>
                          <i
                            className={`fa-regular fa-thumbs-up ${song.likes > 0 ? 'liked' : ''}`}
                            onClick={() => handleLikeClick(song.id)} // Pass song_api_id for backend interaction
                          ></i>
                          <span>{song.likes}</span>
                        </td>
                      </tr>
                    );
                    })
                  }
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

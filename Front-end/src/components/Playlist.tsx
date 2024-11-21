import React, { useEffect, useState } from 'react';
import { useApplication } from '../hooks/useApplicationData';
import axios from 'axios';
import '../styles/Playlist.scss'

interface Song {
  id: number;
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
}

interface PlayListProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlayList = ({ isOpen, onClose }: PlayListProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const { formatDuration } = useApplication();

  console.log("Playlist here");

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // fetch data from backend
        const response = await axios.get('http://localhost:3000/songs');
        const data = response.data;
        // console.log("Playlist = ", data);

        // Check if the data is an array before setting the state
        if (Array.isArray(data)) {
          setSongs(data);
        } else {
          console.error("Expected an array of songs but got:", data);
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    fetchSongs();
  }, []);

  // Helper function to sort songs by likes (highest to lowest)
  const sortSongsByLikes = (songs: Song[]) => {
    return [...songs].sort((a, b) => b.likes - a.likes); // Sort by likes in descending order
  };
    
  // Helper Function that handle the thumb icon, likes.
  const handleLikeClick = async (songId: number) => {
    try {
      const response = await axios.patch(`http://localhost:3000/songs/${songId}/like`);
      console.log("PLAYLIST handleLikeClick: ", response);
      const updatedSong = response.data;
      
      console.log("PLAYLIST. updatedSong new LIKES: ", updatedSong.likes);
      
      setSongs((prevSongs) => prevSongs.map((song) => song.id === updatedSong.id ? {...song, likes: updatedSong.likes } : song )
      );
      console.log("PLAYLIST :", setSongs)

      getLike(updatedSong.likes, songId);
    }
    catch(error) {
      console.log("Playlist, Error updating likes: ", error);
    }
  };
  

  //Testing the likes
  const getLike = (likes: number, songId: number) => {
    // connect to backend songs database
    // get the number of likes
    // display the number of likes
    // the number of likes will the reference to update the likes icon color
    // Update the song's likes and change the icon color accordingly
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === songId
          ? { ...song, likes } // Update the likes count
          : song
      )
    );
  };
  

  return (
    <>
      {/* <h3>Playlist</h3>   */}
      
      <div className="playlist__modal-overlay">
        <div className="playlist__modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="playlist__results">
          <div className='playlist__list-mgr'>
            <table>
              <thead>
                <tr>
                  <th>Track</th>
                  <th>Artist</th>
                  <th>Time</th>
                  <th>Album</th>
                  <th>Likes</th>
                  <th># of Likes</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song, index) => (
                  <tr key={index}>
                    <td className='playlist__list-mgr__title'>{song.title}</td>
                    <td className='playlist__list-mgr__artist'>{song.artist.name}</td>
                    <td>{formatDuration(song.duration)}</td>
                    <td>{song.album.title}</td>
                    <td>
                    <i
                          className={`fa-regular fa-thumbs-up ${song.likes > 0 ? 'liked' : ''}`}
                          onClick={() => handleLikeClick(song.id)}
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
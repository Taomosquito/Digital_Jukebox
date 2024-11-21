// import React from "react";

// const Playlist = () => {
  
//   return (
//     <div>
//       <p>In Progress ... </p>
//     </div>
//   );
// }

// export default Playlist;import React, { useEffect, useState } from 'react';


import React, { useEffect, useState } from 'react';
import { useApplication } from '../hooks/useApplicationData';
import axios from 'axios';
import '../styles/Playlist.scss'

interface Song {
  title: string;
  duration: number;
  artist: {
    name: string;
    picture_small: string;
  };
  album: {
    title: string;
  };
}

interface PlayListProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlayList = ({ isOpen, onClose }: PlayListProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { audioRefs, playingSong, handlePlayClick, formatDuration } = useApplication();

  console.log("Playlist here");

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // fetch data from backend
        const response = await axios.get('http://localhost:3000/songs');
        const data = response.data;

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
                </tr>
              </thead>
              <tbody>
                {songs.map((song, index) => (
                  <tr key={index}>
                    <td className='playlist__list-mgr__title'>{song.title}</td>
                    <td className='playlist__list-mgr__artist'>{song.artist.name}</td>
                    <td>{formatDuration(song.duration)}</td>
                    <td>{song.album.title}</td>
                    <td><i className="fa-regular fa-thumbs-up"></i></td>
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
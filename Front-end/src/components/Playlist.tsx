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
import axios from 'axios';

interface Song {
  title: string;
  preview: string;
  artist: {
    name: string;
    picture_small: string;
  };
  album: {
    cover_small: string;
  };
}

const Playlist = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log("Playlist here");

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // Use axios to fetch data from your backend
        const response = await axios.get('http://localhost:3000/songs');
        
        // Axios automatically parses the response data, so no need for .json()
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
    <div className="playlist">
      <h2>Your Playlist</h2>
      <div className="song-list">
        {songs.map((song, index) => (
          <div key={index} className="song-item">
            <img src={song.album.cover_small} alt={song.title} />
            <h3>{song.title}</h3>
            <p>{song.artist.name}</p>
            <audio controls>
              <source src={song.preview} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
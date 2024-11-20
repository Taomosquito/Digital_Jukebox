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

const Playlist: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the songs from your backend
    axios.get('/songs')
      .then((response) => {
        setSongs(response.data);  // Set the song details
        setLoading(false);         // Set loading to false once data is fetched
      })
      .catch((err) => {
        setError('Failed to load songs');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
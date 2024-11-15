import React, { useState } from 'react';
import useMusicApi from '../hooks/useMusicApi';

const ClientPlayer = () => {
  const [query, setQuery] = useState("Pearl Jam");
  const [searchQuery, setSearchQuery] = useState(query); // Store the query for search

  // Use the searchQuery to trigger the API call
  const {data, loading, error } = useMusicApi(searchQuery);

  // This function only triggers when the Search button is clicked
  const handleSearchClick = () => {
    setSearchQuery(query);
  };

  //This convert the song duration to time format.
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Update query on change, no API call yet
        placeholder="Search for a song"
      />
      <button onClick={handleSearchClick}>Search</button>

      {loading && <p>Loading...</p>}
      {error && <p>Error fetching data</p>}
      {data && (
        <div>
          <h3>"{query}"  Result</h3>
          <br></br>

          <table>

            <thead>
              <tr>
                <th>Album</th>
                <th>Track</th>
                <th>Artist</th>
                <th>Time</th>
                <th>Preview</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>
              {data?.data.map((song) => (
                <tr key={song.id}>
                  <td>
                    <img src={song.album.cover} alt={song.title} width="50" height="50" />
                  </td>
                  <td>{song.title}</td>
                  <td>{song.artist.name}</td>
                  <td>{formatDuration(song.duration)}</td>
                  <td>
                    <audio controls>
                      <source src={song.preview} type="audio/mp3" />
                    </audio>
                  </td>
                  <td>"Add link Pending"</td>
                </tr>
              ))}
            </tbody>
          </table>

{/* 
          {data.data.map((song) => (
            <div key={song.id}>
              <p>{song.title}</p>
              <img src={song.album.cover} alt={song.title} />
              <audio controls>
                <source src={song.preview} type="audio/mp3" />
              </audio>
            </div>
          ))} */}
        </div>
      )}
    </div>
  );
};

export default ClientPlayer;
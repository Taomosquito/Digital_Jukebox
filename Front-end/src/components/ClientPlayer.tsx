import React from 'react';

interface ClientPlayerProps {
  rawResults: any[];  // Receive raw results to organize
}

const ClientPlayer = ({ rawResults }: ClientPlayerProps) => {
  // This function organizes the raw results (e.g., sorting by song title)
  const organizeResults = (results: any[]) => {
    return results.sort((a, b) => a.title.localeCompare(b.title)); // Sort the result by title or track name
  };

  const organizedResults = organizeResults(rawResults);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div>
      {organizedResults.length > 0 ? (
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
            {organizedResults.map((song) => (
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
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default ClientPlayer;

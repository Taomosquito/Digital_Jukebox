import { useState, useRef } from 'react';

interface ClientPlayerProps {
  rawResults: any[];
  onSelectedSongsChange: (selectedSongs: any[]) => void;  // Callback to send selected songs back to parent
}

const ClientPlayer = ({ rawResults, onSelectedSongsChange }: ClientPlayerProps) => {
  // Organize the raw results (e.g., sorting by song title)
  const organizeResults = (results: any[]) => {
    return results.sort((a, b) => a.title.localeCompare(b.title)); // Sort by title
  };
  const organizedResults = organizeResults(rawResults); //a, b, c

  // Track play state per song
  const [playingSong, setPlayingSong] = useState<string | null>(null); // Store ID of the currently playing song
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({}); // Store refs for each audio element

  // Format the song duration into a readable time format
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const [selectedSongs, setSelectedSongs] = useState<any[]>([]); // Track selected songs

  // Handle checkbox change: add or remove songs from the selected list
  const handleCheckboxChange = (song: any, isChecked: boolean) => {
    setSelectedSongs((prev) => {
      const updatedSelection = isChecked
        ? [...prev, song]  // Add song if checked
        : prev.filter((s) => s.id !== song.id);  // Remove song if unchecked

      // Notify the parent component with the updated list of selected songs
      onSelectedSongsChange(updatedSelection);
      return updatedSelection;
    });
  };

  const handlePlayClick = (song: any) => {
    if (audioRefs.current[song.id]) {
      if (playingSong === song.id) {
        // If the clicked song is already playing, pause it
        audioRefs.current[song.id]?.pause();
        setPlayingSong(null); // Reset the playing song state
      } else {
        // Pause the currently playing song
        if (playingSong !== null && audioRefs.current[playingSong]) {
          audioRefs.current[playingSong]?.pause();
        }
        // Play the new song
        audioRefs.current[song.id]?.play();
        setPlayingSong(song.id); // Update the currently playing song state
      }
    }
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
              <th>Add to Playlist</th>
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
                  <i
                    className={`fa-solid ${playingSong === song.id ? 'fa-pause' : 'fa-play'}`}
                    onClick={() => handlePlayClick(song)}
                  ></i>
                  <audio ref={(el) => { audioRefs.current[song.id] = el }} hidden>
                    <source src={song.preview} type="audio/mp3" />
                  </audio>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedSongs.some((s) => s.id === song.id)}  // Track checked state
                    onChange={(e) => handleCheckboxChange(song, e.target.checked)}
                  />
                </td>
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

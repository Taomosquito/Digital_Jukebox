import React, { useState, useEffect } from 'react';
import { useApplication } from '../hooks/useApplicationData';
import { useWebSocket } from '../context/WebSocketContext';
import axios from 'axios';
import '../styles/JukeBoxPlayer.scss';

interface Song {
  id: number;
  song_api_id: number;
  title: string;
  duration: number;
  artist: {
    name: string;
  };
  album: {
    title: string;
    cover: string;
  };
  likes: number;
  created_at: string;
  preview: string;
}

const JukeBoxPlayer = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Song | null>(null);
  const [nextSong, setNextSong] = useState<Song | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 770); //
  const { formatDuration } = useApplication();
  const socket = useWebSocket();

  useEffect(() => {
    // Function to check window width and update the state
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 770);
    };

    // Listen for window resize event
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fetch songs from server initially
  useEffect(() => {
    const fetchSongs = async () => {
      try { 
        const response = await axios.get("/back-end/songs", { headers: { 'Accept': 'application/json' }});

        const data = response.data;
        
        if (Array.isArray(data)) {
          const sortedSongs = sortSongsByLikes(data);
          setSongs(sortedSongs);
          updateNowPlayingNext(sortedSongs);
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };
    fetchSongs();
  }, []);

  // WebSocket listeners for song updates
  useEffect(() => {
    if (socket) {
      console.log('WebSocket connected');

      // Handle song liked event
      socket.on('songLiked', (updatedSong: Song) => {
        console.log('Received songLiked event:', updatedSong);
        setSongs((prevSongs) => {
          const updatedSongs = prevSongs.map((song) =>
            song.song_api_id === updatedSong.song_api_id
              ? { ...song, likes: updatedSong.likes }
              : song
          );
          const sortedSongs = sortSongsByLikes(updatedSongs);
          updateNowPlayingNext(sortedSongs);
          return sortedSongs;
        });
      });

      // Handle song added event (prevents duplicates)
      socket.on('songAdded', (addedSong: Song) => {
        console.log('Received songAdded event:', addedSong);
        setSongs((prevSongs) => {
          const newSongs = prevSongs.some(
            (song) => song.song_api_id === addedSong.song_api_id
          )
            ? prevSongs
            : sortSongsByLikes([...prevSongs, addedSong]);
          updateNowPlayingNext(newSongs);
          return newSongs;
        });
      });

      // Handle playlist song event (prevents duplicates)
      socket.on('playlistSong', (songs: Song[]) => {
        console.log("Received all songs from database: ", songs);
        const newSongs = songs.filter(
          (song, index, self) =>
            index === self.findIndex((t) => t.song_api_id === song.song_api_id)
        );
        const sortedSongs = sortSongsByLikes(newSongs);
        setSongs(sortedSongs);
        updateNowPlayingNext(sortedSongs);
      });

      // Listen for song deletion events
      socket.on('songDeleted', (data) => {
        console.log(data.message);
        setSongs((prevSongs) => {
          const updatedSongs = prevSongs.filter((song) => song.id !== data.id);
          updateNowPlayingNext(updatedSongs);
          return updatedSongs;
        });
      });

      // Listen for the songsDeleted event (all songs deleted)
      socket.on('songsDeleted', (data) => {
        console.log(data.message); // Log message for debugging
        setSongs([]); // Clear the playlist
        setNowPlaying(null); // Reset nowPlaying
        setNextSong(null); // Reset nextSong
      });
    } else {
      console.error('WebSocket not connected');
    }
  }, [socket]);

  // Sort songs by likes, then creation time
  const sortSongsByLikes = (songs: Song[]) => {
    return songs.sort((a, b) => {
      if (b.likes !== a.likes) {
        return b.likes - a.likes;
      }
      return (a.created_at || '').localeCompare(b.created_at || '');
    });
  };

  // Update Now Playing and Next Song after playlist update
  const updateNowPlayingNext = (sortedSongs: Song[]) => {
    if (sortedSongs.length > 0) {
      setNowPlaying(sortedSongs[0]);
      setNextSong(sortedSongs[1] || null);
    } else {
      setNowPlaying(null);
      setNextSong(null);
    }
  };

  const handleSongEnd = async () => {
    if (nowPlaying) {
      try {
        // Send the delete request to the server
        await axios.delete(`/back-end/songs/${nowPlaying.id}`);
        console.log(`Song ${nowPlaying.title} removed from database`);

        // Emit the 'songDeleted' event to notify the server and other clients
        socket?.emit('songDeleted', { id: nowPlaying.id, message: `Song ${nowPlaying.title} has been deleted` });
      } catch (error) {
        console.error('Error deleting song from database:', error);
      }
    }
  };

  return (
    <div className="juke-box-player">
      <div className="juke-box-player__content">
        <h3>Now Playing</h3>
        {nowPlaying ? (
          <div className="juke-box-player__now-playing">
            <div className="juke-box-player__now-playing__content">
              <img src={nowPlaying.album.cover} alt={nowPlaying.album.title} width="100" height="100" />

              <div className='juke-box-player__now-playing__song-details'>
                <strong>{nowPlaying.title} <i className="fas fa-heart" /></strong>
                {nowPlaying.artist?.name}
                
                <div className='juke-box-player__now-playing__song-play'>
                  <audio
                    src={nowPlaying.preview}
                    //autoPlay
                    controls
                    controlsList="nodownload noplaybackrate"
                    onEnded={handleSongEnd} // Trigger when song ends
                    className="juke-box-player__now-playing__audio"
                    muted={isMobile} //Mute audio if on mobile view
                  ></audio>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="juke-box-player__now-playing">
            "No music playing. Add a tune to get things rolling."
          </p>
        )}
        <h3>Next in the Playlist</h3>
        {nextSong ? (
          <div className="juke-box-player__next-song">
            
            <div className="juke-box-player__next-song__content">
              <strong>{nextSong.title} <i className="fas fa-heart"></i></strong>
              <span>by:  {nextSong.artist?.name}</span>
              Album Title:  {nextSong.album.title}
            </div>
            <div className="juke-box-player__next-song__image">         
              <img src={nextSong.album.cover} alt={nextSong.album.title} width="100" height="100" />
              </div>
          </div>
        ) : (
          <p className="juke-box-player__next-song">
            "No future hits lined up. Let's change that!"
          </p>
        )}
        <h3>Current Playlist</h3>
        <div className="juke-box-player__current-playlist">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Album</th>
                <th>Track</th>
                <th>Artist</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {songs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                  "The JukeBox is waiting for your pick!"
                  </td>
                </tr>
              ) : (
                songs.map((song, index) => (
                  <tr key={song.id}>
                    <td>{(index + 1).toString().padStart(3, "0")}</td>
                    <td>{song.album?.title || "Unknown Album"}</td>
                    <td>{song.title || "Unknown Title"}</td>
                    <td>{song.artist?.name || "Unknown Artist"}</td>
                    <td>{formatDuration(song.duration)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JukeBoxPlayer;

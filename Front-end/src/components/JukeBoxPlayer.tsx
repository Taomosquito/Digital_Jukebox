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
  };
  likes: number;
  preview:string;
}

const JukeBoxPlayer = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Song | null>(null);
  const [nextSong, setNextSong] = useState<Song | null>(null);
  const { formatDuration } = useApplication();
  const socket = useWebSocket();

  // Fetch playlist songs
  const fetchSongs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/songs');
      const data = response.data;
      if (Array.isArray(data)) {
        console.log('Fetched songs:', data);
        const sortedSongs = sortSongsByLikes(data);
        setSongs(sortedSongs);
        setNowPlaying(sortedSongs[0] || null);
        setNextSong(sortedSongs[1] || null);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  useEffect(() => {
    fetchSongs(); // Fetch songs on mount
  }, []);

  // WebSocket listeners for song updates
  useEffect(() => {
    if (socket) {
      console.log('WebSocket connected');
      socket.on('songLiked', (updatedSong: Song) => {
        console.log('Received songLiked event:', updatedSong);
        setSongs((prevSongs) =>
          sortSongsByLikes(
            prevSongs.map((song) =>
              song.song_api_id === updatedSong.song_api_id
                ? { ...song, likes: updatedSong.likes }
                : song
            )
          )
        );
      });

      socket.on('songAdded', (addedSong: Song) => {
        console.log('Received songAdded event:', addedSong);
        setSongs((prevSongs) => {
          const newSongs = sortSongsByLikes([...prevSongs, addedSong]);
          console.log('Updated songs after addition:', newSongs);
          // Set the new "Now Playing" song if there isn't already one playing
          if (!nowPlaying) {
            setNowPlaying(newSongs[0]);
          }
          return newSongs;
        });
      });
    } else {
      console.error('WebSocket not connected');
    }
  }, [socket, nowPlaying]);

  // Sort songs by likes, then creation time
  const sortSongsByLikes = (songs: Song[]) => {
    return songs.sort((a, b) => {
      if (b.likes !== a.likes) {
        return b.likes - a.likes;
      }
      return 0;
    });
  };

  return (
    <div className="juke-box-player">
      <div className="juke-box-player__content">
        <h2>Now Playing</h2>
        {nowPlaying ? (
          <div className="juke-box-player__now-playing">
            <div className="juke-box-player__now-playing__details">
              <strong>{nowPlaying.title}</strong>
              <p>{nowPlaying.artist?.name}</p>
              <p>{formatDuration(nowPlaying.duration)}</p>
              <audio
                src={nowPlaying.preview}
                autoPlay
                controls
                className="juke-box-player__now-playing__audio"
              >
              </audio>
            </div>
          </div>
        ) : (
          <p>No song currently playing</p>
        )}

        <h2>Next in the Playlist</h2>
        {nextSong ? (
          <div className="juke-box-player__next-song">
            <strong>{nextSong.title}</strong> by {nextSong.artist?.name}
          </div>
        ) : (
          <p>No upcoming songs</p>
        )}

        <h2>Current Playlist</h2>
        <div className="juke-box-player__current-playlist">
          <table>
            <thead>
              <tr>
                <th>Album</th>
                <th>Track</th>
                <th>Artist</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => (
                <tr key={song.id}>
                  <td>{song.album?.title}</td>
                  <td>{song.title}</td>
                  <td>{song.artist?.name}</td>
                  <td>{formatDuration(song.duration)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JukeBoxPlayer;

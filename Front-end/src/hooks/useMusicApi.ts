//A custom hook that encapsulates the logic for fetching data from Deezer, handling loading states, and returning the data.

import { useState, useEffect } from 'react';
import axios from 'axios';

// Define the shape of the song data and API response
interface Song {
  id: string;
  title: string;
  duration: number;
  artist: {
    name: string;
  };
  album: {
    cover: string;
    title: string
  };
  preview: string;
}

interface ApiResponse {
  data: Song[];
}

// Define the return type of useMusicApi
interface UseMusicApiReturn {
  data: ApiResponse | null;
  loading: boolean;
  error: Error | null;
}

const useMusicApi = (query: string): UseMusicApiReturn => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const apiKey = import.meta.env.VITE_DEEZER_API_KEY;
        
        // Check if the key is available
        if (!apiKey) {
          throw new Error('API key is missing, check the environment variables');
        }

        const response = await axios.get<ApiResponse>('https://deezerdevs-deezer.p.rapidapi.com/search', {
          params: { q: query },
          headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
          }
        });
        setData(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return { data, loading, error };
};

export default useMusicApi;
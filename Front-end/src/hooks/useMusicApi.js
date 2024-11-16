//A custom hook that encapsulates the logic for fetching data from Deezer, handling loading states, and returning the data.
import { useState, useEffect } from 'react';
import axios from 'axios';
const useMusicApi = (query) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiKey = import.meta.env.VITE_DEEZER_API_KEY;
                // Check if the key is available
                if (!apiKey) {
                    throw new Error('API key is missing, check the environment variables');
                }
                const response = await axios.get('https://deezerdevs-deezer.p.rapidapi.com/search', {
                    params: { q: query },
                    headers: {
                        'x-rapidapi-key': apiKey,
                        'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
                    }
                });
                setData(response.data);
            }
            catch (err) {
                setError(err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [query]);
    return { data, loading, error };
};
export default useMusicApi;

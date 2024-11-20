import express from "express";
import path from "path";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;
import axios from "axios";
import cors from 'cors';
// Use import.meta.url to resolve the path in ES Modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);
// handles dotenv for databasing
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const dbConfig = {
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
};
const PORT = 3000;
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
}));
// Add middleware to parse JSON request bodies
app.use(express.json()); // Crucial. Parse JSON.
// Path to the build folder
const buildPath = path.resolve(__dirname, "../"); // Adjust this path as needed
// Serve static files from the React build directory
app.use(express.static(buildPath));
// Setup PostgreSQL client
const pool = new Pool({
    host: dbConfig.dbHost,
    port: 5432, // default postgreSQL port
    user: dbConfig.dbUser,
    password: dbConfig.dbPass,
    database: dbConfig.dbName,
});
pool
    .connect()
    .then(() => console.log("Connected to PostgreSQL database"))
    .catch((err) => console.error("Error connecting to PostgreSQL database: ", err));
// DB query
const insertSongIntoDatabase = async (songApiId) => {
    console.log("Attempting to insert song with ID:", songApiId);
    try {
        // Insert song into the database
        const query = `
      INSERT INTO songs (song_api_id, likes, created_at, updated_at)
      VALUES ($1, 0, NOW(), NOW())
      ON CONFLICT (song_api_id) DO NOTHING
    `;
        // Use the songApiId as a parameter to prevent SQL injection
        await pool.query(query, [songApiId]);
        console.log(`Successfully inserted. The ID: ${songApiId}`);
    }
    catch (error) {
        console.error("Sorry, Error inserting:", error);
    }
};
// Catch-all route to serve the React app for any other requests
// Temporary disabled to get all the songs from database.
//
// app.get("*", (req, res) => {
//   console.log('GETTTT - server running');
//   res.sendFile(path.resolve(buildPath, "index.html"));
// });
app.post('/addSongs', async (req, res) => {
    console.log('Received a request to add songs');
    const songs = req.body; // [{}]
    console.log('Received songs:', songs);
    try {
        for (const song of songs) {
            await insertSongIntoDatabase(song.id);
        }
        res.status(200).json({ message: 'Songs added successfully to our Database!' });
    }
    catch (error) {
        console.error('Error adding songs:', error);
        res.status(500).json({ message: 'Failed to add songs' });
    }
});
app.get('/songs', async (req, res) => {
    console.log("GETTTT - All Songs");
    try {
        // Fetch the song details from the database
        const result = await pool.query('SELECT * FROM songs');
        const songs = result.rows;
        // Fetch song details from Deezer API for each song
        const songDetailsPromises = songs.map(async (song) => {
            const response = await axios.get(`https://deezerdevs-deezer.p.rapidapi.com/track/${song.song_api_id}`, {
                headers: {
                    'x-rapidapi-key': process.env.VITE_DEEZER_API_KEY,
                },
            });
            return response.data;
        });
        const songDetails = await Promise.all(songDetailsPromises);
        res.json(songDetails); // Return the song details including title, artist, duration, and preview
    }
    catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({ message: 'Failed to fetch songs' });
    }
});
// Start the server
app.listen(PORT, async () => {
    console.log(`Server is running on port: ${PORT}`);
});

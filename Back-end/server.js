import express from "express";
import path from "path";
import dotenv from "dotenv";
import pkg from "pg";
import axios from "axios";
import cors from "cors";
import bcrypt from "bcrypt";
import { Server as SocketIOServer } from "socket.io";
const { Pool } = pkg;
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
    origin: "http://localhost:5173",
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
// Create Socket.IO instance attached to the HTTP server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true, //Allow cookies
    },
    transports: ["websocket", "polling"], // Ensure WebSocket and fallback are configured
});
io.on("connection", (socket) => {
    console.log(`Server New client connected: ${socket.id}`);
    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});
// DB query
const insertSongIntoDatabase = async (songApiId) => {
    console.log("Attempting to insert song with ID:", songApiId);
    try {
        // Insert song into the database
        const query = `
      INSERT INTO songs (song_api_id)
      VALUES ($1)
      RETURNING *
    `;
        // Use the songApiId as a parameter to prevent SQL injection
        const { rows } = await pool.query(query, [songApiId]);
        /** [ {id: , song_api_id: , likes: 0, created_at: , updated_at: } ] */
        console.log("new songs added to dbase, AddSong: ", rows[0]);
        /**  {id: , song_api_id: , likes: 0, created_at: , updated_at: }  */
        const newSongAdded = { song_api_id: songApiId, ...rows[0] };
        console.log("New song object: ", newSongAdded);
        /**{
              song_api_id: '4688887',
              id: 6,
              likes: 0,
              created_at: 2024-11-26T17:11:00.786Z,
              updated_at: 2024-11-26T17:11:00.786Z
            }
     */
        return newSongAdded;
    }
    catch (error) {
        console.error("Sorry, Error inserting:", error);
    }
};
// add admins to database
// event listener
app.post("/admins", async (req, res) => {
    console.log("Attempting to insert admin into database");
    const { username, password } = req.body;
    console.log(username, password);
    if (!username || !password) {
        return res.status(400).send("Username and password are required");
    }
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Resolve the hashed password
        const query = `INSERT INTO administrators(username, password_digest) VALUES ($1, $2)`;
        await pool.query(query, [username, hashedPassword]);
        console.log(`Successfully inserted. The admin: ${username}`);
        res.status(201).send("Admin successfully added");
    }
    catch (error) {
        console.error("Sorry, Error inserting:", error);
        res.status(500).send("Error adding admin to the database");
    }
});
app.post("/addSongs", async (req, res) => {
    try {
        for (const deezerSong of req.body) {
            const song = await insertSongIntoDatabase(deezerSong.id);
            // const response = await axios.get(
            //   `https://deezerdevs-deezer.p.rapidapi.com/track/${song.song_api_id}`,
            //   {
            //     headers: {
            //       "x-rapidapi-key": process.env.VITE_DEEZER_API_KEY,
            //     },
            //   }
            // );
            const playlistSong = {
                ...song,
                title: deezerSong.title,
                artist: deezerSong.artist.name,
                duration: deezerSong.duration,
                preview: deezerSong.preview,
                album_title: deezerSong.album.title,
                album_cover: deezerSong.album.cover,
                album_cover_medium: deezerSong.album.cover_medium,
                image: deezerSong.md5_image,
            };
            console.log("===== addSong requested SONG: ");
            console.log(song); /** {
                                    song_api_id: '4688887',
                                    id: 6,
                                    likes: 0,
                                    created_at: 2024-11-26T17:11:00.786Z,
                                    updated_at: 2024-11-26T17:11:00.786Z
                                  }
                                  */
            // Emit the event to notify clients of new songs added to list.
            io.emit("songAdded", playlistSong);
            console.log("Emit the songs added: ", playlistSong);
        }
        res
            .status(200)
            .json({ message: "Songs added successfully to our Database!" });
    }
    catch (error) {
        console.error("Error adding songs:", error);
        res.status(500).json({ message: "Failed to add songs" });
    }
});
// login route event listener
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res
            .status(400)
            .send({ message: "Username and password are required" });
    }
    try {
        // Retrieve the user from the database
        const query = `SELECT * FROM administrators WHERE username = $1`;
        const result = await pool.query(query, [username]);
        if (result.rows.length === 0) {
            return res.status(401).send({ message: "Invalid username or password" });
        }
        const admin = result.rows[0];
        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, admin.password_digest);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid username or password" });
        }
        return res.status(200).send({
            message: "Login successful",
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
});
app.get("/songs", async (req, res) => {
    try {
        // Fetch the song details from the database, order by likes and created at.
        const result = await pool.query("SELECT * FROM songs ORDER BY likes DESC, created_at ASC;");
        const songs = result.rows;
        // Fetch song details from Deezer API for each song
        const songDetailsPromises = songs.map(async (song) => {
            // const response = await axios.get(`https://api.deezer.com/track/${song.song_api_id}`);
            const response = await axios.get(`https://deezerdevs-deezer.p.rapidapi.com/track/${song.song_api_id}`, {
                headers: {
                    "x-rapidapi-key": process.env.VITE_DEEZER_API_KEY,
                },
            });
            const playlistSong = {
                ...song,
                title: response.data.title,
                artist: response.data.artist, //name
                album: response.data.album,
                duration: response.data.duration,
                preview: response.data.preview,
                album_title: response.data.album.title,
                album_cover: response.data.album.cover,
                album_cover_medium: response.data.album.cover_medium,
                image: response.data.md5_image,
            };
            console.log("Server Fetch Songs: ", song);
            console.log("Server fetch Songs with Deezer: ", playlistSong);
            //io.emit('songAdded', playlistSong)
            return playlistSong;
        });
        const songDetails = await Promise.all(songDetailsPromises);
        res.json(songDetails); // Return the song details including title, artist, duration, and preview, and ...
    }
    catch (error) {
        console.error("Error fetching songs:", error);
        res.status(500).json({ message: "Failed to fetch songs" });
    }
});
//Routes that partially update the resource
app.patch("/songs/:id/like", async (req, res) => {
    const { id } = req.params;
    console.log("Received song API ID:", id);
    console.log("Typeof; ", typeof (id));
    try {
        // Increment the likes for the song using the `id`
        const result = await pool.query(`UPDATE songs SET likes = likes + 1, updated_at = NOW() WHERE id = $1 RETURNING *`, [id] // Use the `id` to update the song
        );
        // If no song was found with that `id`, return a 404 error.
        if (result.rows.length === 0) {
            res.status(404).json({ message: "Song not found" });
            return;
        }
        // Get the updated song from the result
        const updatedSong = result.rows[0];
        console.log("Server updatedSong : ", updatedSong);
        // Fetch Deezer data for the updated song using the `song_api_id`
        const response = await axios.get(`https://deezerdevs-deezer.p.rapidapi.com/track/${updatedSong.song_api_id}`, {
            headers: {
                "x-rapidapi-key": process.env.VITE_DEEZER_API_KEY, // Deezer API key
            },
        });
        // Combine the Deezer data with the updated song data
        const songWithDeezerData = {
            ...updatedSong,
            title: response.data.title,
            artist: response.data.artist.name,
            album: response.data.album,
            duration: response.data.duration,
            preview: response.data.preview,
            album_title: response.data.album.title,
            album_cover: response.data.album.cover,
            album_cover_medium: response.data.album.cover_medium,
            image: response.data.md5_image,
        };
        //This emit to all clients with the updated song data
        console.log("Emitting songLiked event:", songWithDeezerData);
        io.emit("songLiked", songWithDeezerData);
        // Return the updated song with likes and Deezer details
        res.json(songWithDeezerData);
        return;
    }
    catch (error) {
        console.error("Error updating likes:", error);
        res.status(500).json({ message: "Failed to update likes" });
        return;
    }
});
//Route: Delete all songs
app.delete("/songs", async (req, res) => {
    try {
        const client = await pool.connect();
        const queryString = "TRUNCATE TABLE songs RESTART IDENTITY";
        await client.query(queryString);
        client.release(); //back to pool
        res.status(200).json({ message: "All songs are now deleted and ID reset" });
    }
    catch (error) {
        console.log("Error deleting the all the songs: ", error);
        res.status(500).json({ message: "Failed to delete songs" });
    }
});
// Start the server
// app.listen(PORT, async () => {
//   console.log(`Server is running on port: ${PORT}`);
// });

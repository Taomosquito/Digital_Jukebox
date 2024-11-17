import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;
import axios from "axios";

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

console.log(dbConfig);

const PORT: number = 3000;
const app = express();

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
  .catch((err: string) =>
    console.error("Error connecting to PostgreSQL database: ", err)
  );

(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Database connected:", res.rows);
  } catch (err) {
    console.error("Database connection error:", err);
  }
})();

// Interface for Deezer song response
interface Song {
  id: string;
  title: string;
  duration: number;
  artist: {
    name: string;
  };
  album: {
    cover: string;
    title: string;
  };
  preview: string;
}

interface ApiResponse {
  data: Song[];
}

// Fetch songs from Deezer API
const fetchSongsFromDeezer = async (query: string) => {
  const apiKey = process.env.VITE_DEEZER_API_KEY;
  if (!apiKey) {
    throw new Error("API key is missing!");
  }

  const response = await axios.get<ApiResponse>(
    "https://deezerdevs-deezer.p.rapidapi.com/search",
    {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
      },
      params: {
        q: query,
      },
    }
  );
  console.log(response.data.data);
  return response.data.data;
};

// Insert song API IDs into the database
const insertSongIntoDatabase = async (songApiId: string) => {
  console.log("Attempting to insert song with ID:", songApiId);
  try {
    console.log("Inserting song with ID: ", songApiId);
    await pool.query(`INSERT INTO songs (song_api_id) VALUES ($1)`, [
      songApiId,
    ]);

    console.log(`Successfully inserted song with ID: ${songApiId}`);
  } catch (error) {
    console.error("Error inserting song into DB:", error);
  }
};

// Define API route to connect to Deezer
app.get("/api", async (req: Request, res: Response): Promise<any> => {
  const query = req.query.q as string; // Get the search query parameter
  console.log(query);

  try {
    // Fetch songs from Deezer API
    const songs = await fetchSongsFromDeezer(query);

    // Insert each song's API ID into the database
    const insertPromises = songs.map(async (song) => {
      console.log("Processing song:", song.id);
      await insertSongIntoDatabase(song.id);
    });

    // Wait for all insert operations to complete
    await Promise.all(insertPromises);

    // Respond with the data from Deezer API
    res.json(songs);
  } catch (error) {
    console.error("Error in /api/search route:", error);
    res.status(500).json({ message: "Failed to process request" });
  }
});

// Catch-all route to serve the React app for any other requests
app.get("*", (req, res) => {
  res.sendFile(path.resolve(buildPath, "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

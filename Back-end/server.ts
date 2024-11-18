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

// Function to execute your logic on boot
const runOnBoot = async () => {
  const query = "pop"; // Replace with your desired default query or logic
  console.log("Running startup task with query:", query);

  try {
    // Fetch songs from Deezer API
    const songs = await fetchSongsFromDeezer(query);

    // Insert each song's API ID into the database
    for (const song of songs) {
      console.log("Processing song:", song.id);
      await insertSongIntoDatabase(song.id);
    }

    console.log("Startup task completed successfully.");
  } catch (error) {
    console.error("Error during startup task:", error);
  }
};

// Catch-all route to serve the React app for any other requests
app.get("*", (req, res) => {
  res.sendFile(path.resolve(buildPath, "index.html"));
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on port: ${PORT}`);
  await runOnBoot();
});

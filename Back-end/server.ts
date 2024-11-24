import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;
import axios from "axios";
import cors from "cors";
import bcrypt from "bcrypt";

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

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

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
  .catch((err: string) =>
    console.error("Error connecting to PostgreSQL database: ", err)
  );

// DB query
const insertSongIntoDatabase = async (songApiId: string) => {
  console.log("Attempting to insert song with ID:", songApiId);

  try {
    // Insert song into the database
    const query = `
      INSERT INTO songs (song_api_id)
      VALUES ($1)
    `;

    // Use the songApiId as a parameter to prevent SQL injection
    await pool.query(query, [songApiId]);

    console.log(`Successfully inserted. The ID: ${songApiId}`);
  } catch (error) {
    console.error("Sorry, Error inserting:", error);
  }
};

app.post("/admins", async (req: Request, res: Response): Promise<any> => {
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
  } catch (error) {
    console.error("Sorry, Error inserting:", error);
    res.status(500).send("Error adding admin to the database");
  }
});

app.post("/addSongs", async (req: Request, res: Response) => {
  console.log("Received a request to add songs");
  const songs = req.body; // [{}]
  console.log("Received songs:", songs);

  try {
    for (const song of songs) {
      await insertSongIntoDatabase(song.id);
    }
    res
      .status(200)
      .json({ message: "Songs added successfully to our Database!" });
  } catch (error) {
    console.error("Error adding songs:", error);
    res.status(500).json({ message: "Failed to add songs" });
  }
});

app.get("/songs", async (req, res) => {
  try {
    // Fetch the song details from the database, order by likes and created at.
    const result = await pool.query(
      "SELECT * FROM songs ORDER BY likes DESC, created_at ASC;"
    );
    const songs = result.rows;

    console.log("FETCHED SONGS FROM DBASE: ", songs);

    // Fetch song details from Deezer API for each song
    const songDetailsPromises = songs.map(async (song) => {
      // const response = await axios.get(`https://api.deezer.com/track/${song.song_api_id}`);
      const response = await axios.get(
        `https://deezerdevs-deezer.p.rapidapi.com/track/${song.song_api_id}`,
        {
          headers: {
            "x-rapidapi-key": process.env.VITE_DEEZER_API_KEY,
          },
        }
      );
      return response.data;
    });

    const songDetails = await Promise.all(songDetailsPromises);

    res.json(songDetails); // Return the song details including title, artist, duration, and preview, and ...
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).json({ message: "Failed to fetch songs" });
  }
});

//Routes that partially update the resource
app.patch(
  "/songs/:song_api_id/like",
  async (req: Request<{ song_api_id: string }>, res: Response) => {
    const { song_api_id } = req.params;
    console.log("Received song API ID:", song_api_id);

    try {
      // Increment the likes for the song using the `song_api_id`
      const result = await pool.query(
        `UPDATE songs SET likes = likes + 1, updated_at = NOW() WHERE song_api_id = $1 RETURNING *`,
        [song_api_id] // Use the `song_api_id` to update the song
      );

      // If no song was found with that `song_api_id`, return a 404 error.
      if (result.rows.length === 0) {
        res.status(404).json({ message: "Song not found" });
        return;
      }

      // Get the updated song from the result
      const updatedSong = result.rows[0];

      // Fetch Deezer data for the updated song using the `song_api_id`
      const response = await axios.get(
        `https://deezerdevs-deezer.p.rapidapi.com/track/${updatedSong.song_api_id}`,
        {
          headers: {
            "x-rapidapi-key": process.env.VITE_DEEZER_API_KEY, // Deezer API key
          },
        }
      );

      // Combine the Deezer data with the updated song data
      const songWithDeezerData = {
        ...updatedSong,
        title: response.data.title,
        artist: response.data.artist,
        album: response.data.album,
        duration: response.data.duration,
        preview: response.data.preview,
      };

      // Return the updated song with likes and Deezer details
      res.json(songWithDeezerData);
      return;
    } catch (error) {
      console.error("Error updating likes:", error);
      res.status(500).json({ message: "Failed to update likes" });
      return;
    }
  }
);

//Route: Delete all songs
app.delete("/songs", async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    const queryString = "TRUNCATE TABLE songs RESTART IDENTITY";
    await client.query(queryString);
    client.release(); //back to pool
    res.status(200).json({ message: "All songs are now deleted and ID reset" });
  } catch (error) {
    console.log("Error deleting the all the songs: ", error);
    res.status(500).json({ message: "Failed to delete songs" });
  }
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on port: ${PORT}`);
});

import express, { Request, Response } from "express";
import session from "express-session";
import path from "path";
import dotenv from "dotenv";
import pkg from "pg";
import axios from "axios";
import cors from "cors";
import bcrypt from "bcrypt";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";
import cookieParser from "cookie-parser";

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

const PORT: number = 3000;
const app = express();
// Middleware setup
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "a1b2c3d4e5f6g7h8i9j10k11l12m13n14o15p16q17r18s19t20u21v22w23x24y25z26", // Secret for signing the session cookie
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure only in production
      httpOnly: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);
app.use(cookieParser());
//Middleware to parse JSON and URL-encoded data
app.use(express.json()); // Parse JSON.
app.use(express.urlencoded({ extended: true }));

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

// Create an HTTP server and attach the Express app to it
const server = createServer(app);

//Create Socket.IO instance attached to the HTTP server
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173", // Dynamic origin for development and deployment.
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true, //Allow cookies
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Successful connection only. Fetch and send the complete playlist when a client connects
  const fetchAndEmitPlaylist = async () => {
    try {
      const result = await pool.query(
        "SELECT * FROM songs ORDER BY likes DESC, created_at ASC;"
      );

      const songs = result.rows;

      const songDetailsPromises = songs.map(async (song) => {
        const response = await axios.get(
          `https://deezerdevs-deezer.p.rapidapi.com/track/${song.song_api_id}`,
          {
            headers: {
              "x-rapidapi-key": process.env.VITE_DEEZER_API_KEY,
            },
          }
        );

        const playlistSong = {
          ...song,
          title: response.data.title,
          artist: response.data.artist,
          album: response.data.album,
          duration: response.data.duration,
          preview: response.data.preview,
          album_title: response.data.album.title,
          album_cover: response.data.album.cover,
          album_cover_medium: response.data.album.cover_medium,
          image: response.data.md5_image,
        };

        return playlistSong;
      });

      const songDetails = await Promise.all(songDetailsPromises);
      socket.emit("playlistSong", songDetails); // Emit the full playlist
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };
  fetchAndEmitPlaylist();

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

//Proper closing connections helps prevent memory leaks and resource locking
process.on("SIGNINT", () => {
  io.close(() => console.log("Socket.io server is closed"));
  server.close(() => console.log("HTTP server closed"));
});

// DB query
const insertSongIntoDatabase = async (songApiId: string) => {
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
  } catch (error) {
    console.error("Sorry, Error inserting:", error);
  }
};

// add admins to database
// event listener
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

// add locations to database
// event listener
app.post("/add-location", async (req: Request, res: Response): Promise<any> => {
  console.log("Attempting to insert location into database");
  const { latitude, longitude, location } = req.body;
  console.log(latitude, longitude, location);

  if (!latitude || !longitude) {
    return res.status(400).send("latitude and longitude are both required");
  }

  try {
    const query = `INSERT INTO regions(latitude, longitude, location_tag) VALUES ($1, $2, $3)`;
    await pool.query(query, [latitude, longitude, location]);
    console.log(
      `Successfully inserted. The location with values: latitude = ${latitude}, longitude = ${longitude}, location_tag = ${location}`
    );
    res.status(201).send("location successfully added");
  } catch (error) {
    console.error("Sorry, Error inserting:", error);
    res.status(500).send("Error adding location to the database");
  }
});

app.post("/addSongs", async (req: Request, res: Response) => {
  try {
    for (const deezerSong of req.body) {
      const song = await insertSongIntoDatabase(deezerSong.id);

      const playlistSong = {
        ...song,
        title: deezerSong.title,
        artist: deezerSong.artist,
        duration: deezerSong.duration,
        album: deezerSong.album,
        preview: deezerSong.preview,
        album_title: deezerSong.album.title,
        album_cover: deezerSong.album.cover,
        album_cover_medium: deezerSong.album.cover_medium,
        image: deezerSong.md5_image,
      };

      // Emit the event to notify clients of new songs added to list.
      io.emit("songAdded", playlistSong);
      console.log("Emit the songs added: ", playlistSong);
      /** {
            song_api_id: '4688887',
            id: 6,
            likes: 0,
            created_at: 2024-11-26T17:11:00.786Z,
            updated_at: 2024-11-26T17:11:00.786Z,
            ....
          }
          */
    }

    res
      .status(200)
      .json({ message: "Songs added successfully to our Database!" });
  } catch (error) {
    console.error("Error adding songs:", error);
    res.status(500).json({ message: "Failed to add songs" });
  }
});

const getServerLocation = async () => {
  try {
    const response = await axios.get("http://ip-api.com/json/");
    const { lat, lon } = response.data;
    return { latitude: lat, longitude: lon };
  } catch (error) {
    console.error("Error fetching server geolocation:", error);
    throw new Error("Failed to fetch server geolocation.");
  }
};

// Haversine formula to calculate distance
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6378; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

// Source location and maximum range
const MAX_DISTANCE_KM = 0.25; // Define range in kilometers

// Geolocation endpoint
app.post("/geo", async (req: Request, res: Response): Promise<void> => {
  const { latitude, longitude } = req.body;

  // Validate the request
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    res
      .status(400)
      .json({ success: false, message: "Invalid geolocation data." });
    return;
  }

  try {
    // Fetch the server's location
    const serverLocation = await getServerLocation();
    const serverLatitude = serverLocation.latitude;
    const serverLongitude = serverLocation.longitude;

    // Calculate the distance between the user's location and the server's location
    const distance = calculateDistance(
      latitude,
      longitude,
      serverLatitude,
      serverLongitude
    );
    const MAX_DISTANCE_KM = 1; // Set the range in kilometers

    // Check if the user is within the specified range
    const inRange = distance <= MAX_DISTANCE_KM;

    // Save the result in the session (if needed)
    req.session.geo = { latitude, longitude, inRange };

    // Respond with the result
    res.status(200).json({
      success: true,
      inRange,
      distance,
      message: inRange
        ? "User is within range of the server's location."
        : "User is out of range of the server's location.",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// move inside of "/geo to simplify as this will  be too many calls."
app.delete("/geo-delete", (req: Request, res: Response): void => {
  if (req.session.geo) {
    delete req.session.geo; // Remove the geo property from the session
    res.status(200).json({
      success: true,
      message: "Geolocation data has been cleared from the session.",
    });
  } else {
    res.status(400).json({
      success: false,
      message: "No geolocation data to clear.",
    });
  }
});

// login route event listener
// Login route
app.post("/login", async (req: Request, res: Response): Promise<any> => {
  const { username, password, action } = req.body;

  if (action === "logout") {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to log out" });
      }
      res.clearCookie(`connect.sid`);
      res.clearCookie(`username`);
      return res.status(200).json({ message: "Logged out successfully" });
    });
    return;
  }

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const query = "SELECT * FROM administrators WHERE username = $1";
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_digest
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    console.log(
      `login after creation id = ${req.session.userId} username = ${req.session.username} `
    );

    res
      .status(200)
      .json({ message: "Login successful", userId: user.id, loggedIn: true });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

app.get("/songs", async (req, res) => {
  try {
    // Fetch the song details from the database, order by likes and created at.
    const result = await pool.query(
      "SELECT * FROM songs ORDER BY likes DESC, created_at ASC;"
    );

    const songs = result.rows;

    // Fetch song details from Deezer API for each song
    const songDetailsPromises = songs.map(async (song) => {
      const response = await axios.get(
        `https://deezerdevs-deezer.p.rapidapi.com/track/${song.song_api_id}`,
        {
          headers: {
            "x-rapidapi-key": process.env.VITE_DEEZER_API_KEY,
          },
        }
      );

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
      //console.log("Server fetch Songs with Deezer: ", playlistSong);
      // io.emit("playlistSong", playlistSong);
      return playlistSong;
    });

    const songDetails = await Promise.all(songDetailsPromises);
    res.json(songDetails); // Return the song details including title, artist, duration, and preview, and ...
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).json({ message: "Failed to fetch songs" });
  }
});

// Routes that partially update the resource
// TypeScript interface for the request body
interface LikeRequestBody {
  action: "like" | "unlike";
}

app.patch(
  "/songs/:id/like",
  async (req: Request<{ id: string }, any, LikeRequestBody>, res: Response) => {
    const { id } = req.params;
    const { action } = req.body;

    //  // Validate that the `action` is either 'like' or 'unlike'
    //  if (!action || (action !== 'like' && action !== 'unlike')) {
    //   return res.status(400).json({
    //     message: "Invalid action. Must be 'like' or 'unlike'.",
    //   });
    // }
    console.log("Received song API ID:", id);
    console.log("Action:", action);

    try {
      // Set the increment/decrement value based on the action
      const likeChange = action === "like" ? 1 : -1;

      // Query to update the likes count based on the action
      const result = await pool.query(
        `UPDATE songs SET likes = likes + $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
        [likeChange, id] // Increase or decrease likes by 1 based on the action
      );

      // // If no song was found with that `id`, return a 404 error.
      // if (result.rows.length === 0) {
      //   return res.status(404).json({ message: "Song not found" });
      // }

      // Get the updated song from the result
      const updatedSong = result.rows[0];
      console.log("Server updatedSong: ", updatedSong);

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
        album_title: response.data.album.title,
        album_cover: response.data.album.cover,
        album_cover_medium: response.data.album.cover_medium,
        image: response.data.md5_image,
      };

      // Emit the updated song to all clients
      console.log("Emitting songLiked event:", songWithDeezerData);
      io.emit("songLiked", songWithDeezerData);

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
    io.emit("songsDeleted", {
      message: "All songs have been deleted and ID reset",
    });
    res.status(200).json({ message: "All songs are now deleted and ID reset" });
  } catch (error) {
    console.log("Error deleting the all the songs: ", error);
    res.status(500).json({ message: "Failed to delete songs" });
  }
});

//Delete the songs when finish playing
app.delete("/songs/:id", async (req: Request, res: Response) => {
  const songId = parseInt(req.params.id, 10); //ensures the id is a number.

  try {
    const client = await pool.connect();
    const queryString = "DELETE FROM songs WHERE id = $1";
    const result = await client.query(queryString, [songId]);
    client.release(); // Release client back to the pool
    io.emit("songDeleted", {
      id: songId,
      message: `Song with ID ${songId} has been deleted`,
    });

    res
      .status(200)
      .json({ message: `Song with ID ${songId} deleted successfully` });
  } catch (error) {
    console.error("Error deleting song: ", error);
    res.status(500).json({ message: "Failed to delete song" });
  }
});

// Start the server
server.listen(PORT, async () => {
  console.log(`Server is running on port: ${PORT}`);
});

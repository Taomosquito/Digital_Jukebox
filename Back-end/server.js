import express from "express";
import path from "path";
import dotenv from "dotenv";
import pkg from "pg";
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
// Catch-all route to serve the React app for any other requests
app.get("*", (req, res) => {
    res.sendFile(path.resolve(buildPath, "index.html"));
});
// Start the server
app.listen(PORT, async () => {
    console.log(`Server is running on port: ${PORT}`);
});

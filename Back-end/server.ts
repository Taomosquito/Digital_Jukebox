import express from "express";
import path from "path";

const PORT: number = 3000;
const app = express();

// Use import.meta.url to resolve the path in ES Modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);
// Path to the build folder
const buildPath = path.resolve(__dirname, "../"); // Adjust this path as needed

// Serve static files from the React build directory
app.use(express.static(buildPath));

// Define API routes if needed
app.get("/api", (req, res) => {
  res.json({ message: "Hello from the API!" });
});

// Catch-all route to serve the React app for any other requests
app.get("*", (req, res) => {
  res.sendFile(path.resolve(buildPath, "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

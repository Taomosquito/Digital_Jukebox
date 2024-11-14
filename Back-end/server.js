import express from "express"; // This works with esModuleInterop
const PORT = 3000;
const app = express();
// Define a route with types for the request and response objects
app.get("/", (req, res) => {
    // No need to type `req` and `res` explicitly if you're fine with implicit types
    res.send("Hello World");
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

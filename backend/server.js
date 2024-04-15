const app = require("./app");
const port = process.env.PORT || 3001; // Use environment variable or default to 3000

// Start Server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
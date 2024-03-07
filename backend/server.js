const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // If you need cross-origin support
// const { User, Itinerary, Place } = require('./models'); 

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default to 3000

// Optional for Cross-Origin Resource Sharing
app.use(cors()); 

// db.sync({ force: true }) // Use 'force: true' only during initial development to recreate tables
//     .then(() => {
//         console.log('Database models synchronized');   
// });
// Basic Route for Testing
app.get('/', (req, res) => {
  res.send('Welcome to your Express Server for the itinerary app!');
});

// Start Server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
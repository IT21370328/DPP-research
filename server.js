// Importing required dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // For environment variables from .env

const adminRoutes = require('./routes/admin');
const consumerRoutes = require('./routes/consumer');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB", err));

// Sample route to verify server is running
app.get('/', (req, res) => {
  res.send('The server is running.');
});

// Routes
app.use('/api/admin', adminRoutes); // Admin routes
app.use('/api/consumer', consumerRoutes); // Consumer routes


// Start the server on the specified port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

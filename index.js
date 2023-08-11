// index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 5000;

// serve up production assets
app.use(express.static('./client/build'));

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (using the cloud-based MongoDB connection URL)
const dbURI = process.env.MONGO_DB_URL

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Use API routes
app.use('/api', require('./routes/api'));

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

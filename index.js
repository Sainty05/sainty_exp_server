// index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./routes/api')
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
// app.use(cors());
app.use(cors({
  origin: 'https://sainty-exp-app-05.vercel.app',
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

// serve up production assets
app.use(express.static('./client/build'));

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

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// app.options('/api', cors()); // Respond to preflight requests
// Use API routes
app.use('/api', router);

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

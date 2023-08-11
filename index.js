// index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

///

// routes/api.js
//mogo schema
const User = require('../models/User');
const Movie = require('../models/Movie')
const Session = require('../models/Session')
const Expence = require('../models/Expence')
//Node.js using bcrypt
const bcrypt = require('bcrypt');
//unique code
const crypto = require("crypto");

////

const app = express();
const port = 5000;

// serve up production assets
app.use(express.static('./client/build'));

// Middleware
app.use(cors());
app.use(express.json());

// Configure CORS to allow requests from your frontend domain
app.use(cors({
  origin: 'https://sainty-exp-app-05.vercel.app',
  methods: ['GET', 'POST'],  // Adjust the allowed methods as needed
  credentials: true,         // Allow cookies, authentication headers, etc.
}));

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

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

// app.post('/login', async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     let sessionUserId = user._id
//     let sessionToken = crypto.randomBytes(16).toString("hex");
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     } else {
//       const passwordMatch = await bcrypt.compare(req.body.password, user.password);
//       if (!passwordMatch) {
//         return res.status(400).json({ message: 'Invalid password' });
//       }
//       const newToken = new Session({ userId: sessionUserId, sessionToken: sessionToken })
//       await newToken.save();

//       res.json({ message: 'User logged in successfully', session: { sessionToken: sessionToken, sessionId: newToken._id, sessionUserId: sessionUserId, sessionUserName: user.userName } });
//       // res.json({ message: 'User logged in successfully', user });
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
  
// });

// Use API routes
// app.use('/api', require('./routes/api'));

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

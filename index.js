// index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./routes/api')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
// app.use(cors({
//   origin: 'https://sainty-exp-app-05.vercel.app',
//   methods: ['GET', 'POST'],
//   credentials: true,
// }));

app.use(express.json());

// serve up production assets
// app.use(express.static('./client/build'));

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
  res.send(process.env.MONGO_DB_URL)
})

// const Session = require('./models/Session')
// app.post('/api/session', async (req, res) => {
//   // res.json("hello")
//   try {
//     const sessionId = req.body.sessionId
//     const sessionToken = req.body.sessionToken
//     const session = await Session.findOne({ _id: sessionId })
//     if (session.sessionToken === sessionToken) {
//       return res.json({ message: 'Session active for User!', sessionActive: true });
//     } else {
//       return res.status(400).json({ message: 'No session active for User!', sessionActive: false });
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message, sessionActive: false });
//   }
// })

// app.options('/api', cors()); // Respond to preflight requests
// Use API routes
app.use('/api', router, cors());

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

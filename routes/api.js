// routes/api.js
const express = require('express');
const router = express.Router();
//mogo schema
const User = require('../models/User');
const Movie = require('../models/Movie')
const Session = require('../models/Session')
const Expence = require('../models/Expence')
//Node.js using bcrypt
const bcrypt = require('bcrypt');
//unique code
const crypto = require("crypto");

// --------------------------- SESSION ---------------------------------------
router.post('/session', async (req, res) => {
  try {
    const sessionId = req.body.sessionId
    const sessionToken = req.body.sessionToken
    const session = await Session.findOne({ _id: sessionId })
    if (session.sessionToken === sessionToken) {
      return res.json({ message: 'Session active for User!', sessionActive: true });
    } else {
      return res.status(400).json({ message: 'No session active for User!', sessionActive: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, sessionActive: false });
  }
})

// ------------------------ USER ---------------------------
// ------------------- login user ----------------------------
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    let sessionUserId = user._id
    let sessionToken = crypto.randomBytes(16).toString("hex");
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    } else {
      const passwordMatch = await bcrypt.compare(req.body.password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }
      const newToken = new Session({ userId: sessionUserId, sessionToken: sessionToken })
      await newToken.save();

      res.json({ message: 'User logged in successfully', session: { sessionToken: sessionToken, sessionId: newToken._id, sessionUserId: sessionUserId, sessionUserName: user.userName } });
      // res.json({ message: 'User logged in successfully', user });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------- logout user ----------------------------
router.post('/logout', async (req, res) => {
  try {
    await Session.findOneAndDelete({ _id: req.body.sessionId })
    res.json({ message: 'User logged out successfully', sessionActive: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------ Create a new user --------------------- 
router.post('/addUser', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "user added", newUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --------------- Fetch all users ---------------------
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ delete user ------------------------
router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//------------------ fetch user data -----------------------
router.post("/fetchUser", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// ------------------ update user ------------------------
router.put('/updateUser/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;

    // Check if the user exists in the database
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the incoming data with the existing data
    const isDataChanged = Object.keys(updatedData).some((key) => {
      return updatedData[key] !== existingUser[key];
    });

    // If data is not changed, send a warning response
    if (!isDataChanged) {
      return res.status(400).json({ message: 'Please change data to update!' });
    }

    // Update the user with the new data
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------------- MOVIE -------------------------------
// ------------------- add movie -----------------------
router.post('/addMovie', async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.status(201).json({ message: "movie added", newMovie });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// ------------------- fetch all movies -----------------------
router.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// ------------------- delete movie -----------------------
router.delete('/movies/:id', async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully', deletedMovie });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// ------------------- fetch movie data -----------------------
router.post("/fetchMovie", async (req, res) => {
  try {
    const movie = await Movie.findOne({ _id: req.body.id });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    } else {
      res.json(movie);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// ------------------- update movie -----------------------

router.put('/updateMovie/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const updatedData = req.body;
    // Check if the movie exists in the database
    const existingMovie = await Movie.findById(movieId);
    if (!existingMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    // Compare the incoming data with the existing data
    const isDataChanged = Object.keys(updatedData).some((key) => {
      return updatedData[key] !== existingMovie[key];
    });
    // If data is not changed, send a warning response
    if (!isDataChanged) {
      return res.status(400).json({ message: 'Please change data to update!' });
    }
    // Update the movie with the new data
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, updatedData, { new: true });
    res.json(updatedMovie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// -------------------------------------------------- Daily Expences ------------------------------------------------
//--------------------------- Add Expence ----------------------------
router.post('/addExpence', async (req, res) => {
  try {
    const newExpence = new Expence(req.body)
    await newExpence.save()
    res.status(200).json({ message: "Expence added", newExpence });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// ----------------------- fetch Expences ------------------------
router.post('/Expences', async (req, res) => {
  try {
    const { year, month, userId } = req.body; // Extract year and month from query parameters

    // let year = 2023
    // let month = 8

    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required query parameters.' });
    }

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 1);

    const cuurentExpences = await Expence.find({
      createdAt: {
        $gte: startOfMonth,
        $lt: endOfMonth
      },
      userId: userId
    })

    const previousExpences = await Expence.find({
      createdAt: {
        $lt: startOfMonth
      },
      userId: userId
    })
    res.json({ cuurentExpences: cuurentExpences, previousExpences: previousExpences })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// --------------- fetch Expence ------------------------
router.post('/fetchExpence', async (req, res) => {
  try {
    const expence = await Expence.findOne({ _id: req.body.id })
    if (!expence) {
      res.status(404).json({ message: "Expence not found!" })
    } else {
      res.json({ expence })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ---------------- Update Expence ----------------------
router.put('/updateExpence/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    // Check if the movie exists in the database
    const existingExpence = await Expence.findById(id);
    if (!existingExpence) {
      return res.status(404).json({ message: 'Expence not found' });
    }
    // Compare the incoming data with the existing data
    const isDataChanged = Object.keys(updatedData).some((key) => {
      return updatedData[key] !== existingExpence[key];
    });
    // If data is not changed, send a warning response
    if (!isDataChanged) {
      return res.status(400).json({ message: 'Please change data to update!' });
    }
    // Update the movie with the new data
    const updatedMovie = await Expence.findByIdAndUpdate(id, updatedData, { new: true });
    res.json(updatedMovie);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ------------------- Delete Expence -----------------------------
router.delete('/Expence/:id', async (req, res) => {
  try {
    const deletedExpence = await Expence.findByIdAndDelete(req.params.id);
    if (!deletedExpence) {
      return res.status(404).json({ message: 'Expence not found' });
    }
    res.json({ message: 'Expence deleted successfully', deletedExpence });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})


module.exports = router;

// models/User.js
const mongoose = require('mongoose');
const Counter = require('./counter');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  _id: { type: Number }, // This will hold the auto-incrementing ID
  userName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: Number, required: true },
  about: { type: String, required: false },
  // Add more fields as per your requirements
});

// Pre-save middleware to set auto-incrementing ID
userSchema.pre('save', async function (next) {
  const doc = this;
  if (!doc._id) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'userCounter' },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );

      doc._id = counter.count;
    } catch (err) {
      return next(err);
    }
  }
  return next();
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

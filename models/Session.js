const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    sessionToken: { type: String, required: true }
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
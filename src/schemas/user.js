const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: String,
    cash: Number,
    currency: String,
});

module.exports = mongoose.model('user', userSchema);
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    userId: String,
    stock: String,
    amount: Number
});

module.exports = mongoose.model('stocks', stockSchema);
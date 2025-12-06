const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  // We can add more fields like companyName, price, etc. later
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Stock', StockSchema);
const mongoose = require('mongoose');

const HoldingSchema = new mongoose.Schema({
  ticker: { type: String, required: true },
  quantity: { type: Number, required: true },
  buyPrice: { type: Number, required: true } // Price at which you bought it
});

module.exports = mongoose.model('Holding', HoldingSchema);
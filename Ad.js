const mongoose = require('mongoose');
const AdSchema = new mongoose.Schema({
  title: String,
  mediaUrl: String,
  destinationUrl: String,
  startDate: Date,
  endDate: Date,
  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Ad', AdSchema);
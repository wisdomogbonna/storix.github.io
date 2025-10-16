const mongoose = require('mongoose');
const VisitSchema = new mongoose.Schema({
  path: String,
  ip: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Visit', VisitSchema);
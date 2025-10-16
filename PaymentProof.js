const mongoose = require('mongoose');
const PaymentProofSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: String,
  amount: Number,
  accountUsed: String,
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('PaymentProof', PaymentProofSchema);
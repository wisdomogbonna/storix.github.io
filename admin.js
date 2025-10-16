const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Story = require('../models/Story');
const Visit = require('../models/Visit');
const Ad = require('../models/Ad');
const PaymentProof = require('../models/PaymentProof');
const User = require('../models/User');

// Owner dashboard summary
router.get('/dashboard', auth, async (req, res) => {
  if (!req.user?.isOwner) return res.status(403).json({ message: 'Only owner' });
  const totalVisits = await Visit.countDocuments();
  const totalStories = await Story.countDocuments();
  const totalUsers = await User.countDocuments();
  const storyViews = await Story.find().select('title views');
  const pendingPayments = await PaymentProof.find({ verified: false }).populate('user');
  res.json({ totalVisits, totalStories, totalUsers, storyViews, pendingPayments });
});

// Ads: create (owner)
router.post('/ads', auth, async (req, res) => {
  if (!req.user?.isOwner) return res.status(403).json({ message: 'Only owner' });
  const ad = await Ad.create(req.body);
  res.json(ad);
});

// Ads: list active ads public
router.get('/ads', async (req, res) => {
  const now = new Date();
  const ads = await Ad.find({ startDate: { $lte: now }, endDate: { $gte: now } });
  res.json(ads);
});
module.exports = router;
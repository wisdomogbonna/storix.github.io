const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const visit = require('../middleware/visit');
const Story = require('../models/Story');
const PaymentProof = require('../models/PaymentProof');
const multer = require (auth required)
router.get('/', auth, visit, async (req, res) => {
  const stories = await Story.find().select('-episodes.content');
  res.json({ stories });
});

// Create story (owner only)
router.post('/', auth, async (req, res) => {
  if (!req.user?.isOwner) return res.status(403).json({ message: 'Only owner' });
  const story = await Story.create(req.body);
  res.json(story);
});

// Get a story and increment views
router.get('/:id', auth, visit, async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) return res.status(404).json({ message: 'Not found' });
  story.views++;
  await story.save();
  res.json(story);
});

// Get specific episode
router.get('/:id/episodes/:epId', auth, async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) return res.status(404).json({ message: 'Story not found' });
  const episode = story.episodes.id(req.params.epId);
  if (!episode) return res.status(404).json({ message: 'Episode not found' });
  if (episode.isPremium && !req.user.isPremium && !req.user.isOwner) {
    return res.status(402).json({ message: 'Locked. Pay or upload proof.' });
  }
  res.json(episode);
});

// Owner: add episode
router.post('/:id/episodes', auth, async (req, res) => {
  if (!req.user?.isOwner) return res.status(403).json({ message: 'Only owner' });
  const story = await Story.findById(req.params.id);
  story.episodes.push(req.body);
  await story.save();
  res.json(story);
});

// Upload proof of payment (manual opay)
router.post('/payments/upload', auth, upload.single('proof'), async (req, res) => {
  const { amount, account } = req.body;
  const file = req.file;
  if (!file) return res.status(400).json({ message: 'No file uploaded' });
  const proof = await PaymentProof.create({
    user: req.user._id,
    filename: file.filename,
    amount: Number(amount),
    accountUsed: account,
    verified: false
  });
  res.json({ message: 'Uploaded. Owner will verify.', proof });
});

// Owner: verify payment and grant premium
router.post('/payments/:id/verify', auth, async (req, res) => {
  if (!req.user?.isOwner) return res.status(403).json({ message: 'Only owner' });
  const proof = await PaymentProof.findById(req.params.id).populate('user');
  if (!proof) return res.status(404).json({ message: 'Not found' });
  proof.verified = true;
  await proof.save();
  proof.user.isPremium = true;
  await proof.user.save();
  res.json({ message: 'User upgraded to premium', user: proof.user });
});

module.exports = router;
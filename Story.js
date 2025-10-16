const mongoose = require('mongoose');
const EpisodeSchema = new mongoose.Schema({
  title: String,
  content: String,
  isPremium: { type: Boolean, default: false },
  priceNaira: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const StorySchema = new mongoose.Schema({
  title: String,
  description: String,
  coverImage: String,
  author: String,
  episodes: [EpisodeSchema],
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Story', StorySchema);
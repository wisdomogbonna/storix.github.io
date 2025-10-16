require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use('/uploads', express.static('uploads'));

connectDB();

// Auto-create owner on startup
const ensureOwner = async () => {
  const ownerEmail = 'owner@storix.local';
  const password = 'Storix/Wiz.2025';
  if (!await User.findOne({ email: ownerEmail })) {
    const hash = await bcrypt.hash(password, 10);
    await User.create({ name: 'Storix Owner', email: ownerEmail, password: hash, isOwner: true, isPremium: true });
    console.log('Owner created:', ownerEmail);
  }
};
ensureOwner();

app.use('/api/auth', require('./routes/auth'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/contact-info', (req, res) => {
  res.json({ email: 'Storixentertainmentcasting@gmail.com', opayAccount: '7018105690', name: 'storix' });
});

app.listen(process.env.PORT || 5000, () => console.log('Server running!'));
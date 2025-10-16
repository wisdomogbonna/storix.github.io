const Visit = require('../models/Visit');
module.exports = async (req, res, next) => {
  try {
    await Visit.create({ path: req.originalUrl, ip: req.ip, user: req.user?.id });
  } catch (e) {}
  next();
};
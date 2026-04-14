const mongoose = require('mongoose');
require('../models/homecontent');
const HomeContent = mongoose.model('homecontents');

// GET: /api/home — return the single home-page content document
const homeContent = async (req, res) => {
  try {
    const content = await HomeContent.findOne();
    if (!content) {
      return res.status(404).json({ message: 'Home content not found' });
    }
    res.status(200).json(content);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching home content', error: err.message });
  }
};

module.exports = { homeContent };

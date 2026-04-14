const mongoose = require('mongoose');
require('../models/newsarticle');
const NewsArticle = mongoose.model('newsarticles');

// GET: /api/news — return all articles, or filter by ?type=latestNews|vacationTips|featured
const newsList = async (req, res) => {
  try {
    const filter = req.query.type ? { articleType: req.query.type } : {};
    const articles = await NewsArticle.find(filter);
    if (!articles.length) {
      return res.status(404).json({ message: 'No news articles found' });
    }
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching news', error: err.message });
  }
};

module.exports = { newsList };

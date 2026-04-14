const mongoose = require('mongoose');

// articleType drives which optional fields are populated:
//   latestNews  — title, excerpt, date, url
//   vacationTips — title, url
//   featured     — title, image, body (array of paragraphs), publishedAt, author
const newsArticleSchema = new mongoose.Schema({
  articleType: {
    type: String,
    enum: ['latestNews', 'vacationTips', 'featured'],
    required: true,
    index: true,
  },
  title: { type: String, required: true },
  image: { type: String },
  excerpt: { type: String },
  body: [{ type: String }],
  publishedAt: { type: Date },
  url: { type: String },
  author: { type: String },
});

const NewsArticle = mongoose.model('newsarticles', newsArticleSchema);

module.exports = NewsArticle;

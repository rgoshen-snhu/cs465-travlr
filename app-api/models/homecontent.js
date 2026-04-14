const mongoose = require('mongoose');

// Single-document collection — the app always reads the first (and only) document.
const homeContentSchema = new mongoose.Schema({
  hero: {
    image: { type: String, required: true },
    headline: { type: String, required: true },
    body: { type: String, required: true },
  },
  testimonial: {
    quote: { type: String, required: true },
    author: { type: String, required: true },
    url: { type: String },
  },
  sidebar: [
    {
      image: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
});

const HomeContent = mongoose.model('homecontents', homeContentSchema);

module.exports = HomeContent;

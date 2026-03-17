const fs = require('fs');

const { hero, testimonial, sidebar } = JSON.parse(fs.readFileSync('./data/home.json', 'utf-8'));
const { latestNews } = JSON.parse(fs.readFileSync('./data/news.json', 'utf-8'));
const blogPosts = latestNews.slice(0, 2);

/* GET homepage */
const index = function (req, res) {
    res.render('index', { title: 'Tavlr Getaways', hero, blogPosts, testimonial, sidebar });
};

module.exports = { index };

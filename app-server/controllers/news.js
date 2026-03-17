const fs = require('fs');

const { latestNews, vacationTips, featured } = JSON.parse(
    fs.readFileSync('./data/news.json', 'utf-8')
);

/* GET news view */
const news = function (req, res) {
    res.render('news', { title: 'Travlr Getaways - News', latestNews, vacationTips, featured });
};

module.exports = { news };

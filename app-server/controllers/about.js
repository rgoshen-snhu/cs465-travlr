const fs = require('fs');

const { intro, sections } = JSON.parse(fs.readFileSync('./data/about.json', 'utf-8'));

/* GET about view */
const about = function (req, res) {
    res.render('about', { title: 'Travlr Getaways - About', intro, sections });
};

module.exports = { about };

const fs = require('fs');

const trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf-8'));

/* GET travel view */
const travel = function (req, res) {
    res.render('travel', { title: 'Tavlr Getaways', navPage: 'travel', trips });
};

module.exports = { travel };
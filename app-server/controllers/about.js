/* GET about view */
const about = function (req, res) {
    res.render('about', { title: 'Travlr Getaways - About' });
};

module.exports = { about };

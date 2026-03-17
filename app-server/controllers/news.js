/* GET news view */
const news = function (req, res) {
    res.render('news', { title: 'Travlr Getaways - News' });
};

module.exports = { news };

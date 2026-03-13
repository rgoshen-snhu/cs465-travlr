/* Get homepage */
const index = function (req, res) {
    res.render('index', { title: 'Tavlr Getaways' });
};

module.exports = { index };

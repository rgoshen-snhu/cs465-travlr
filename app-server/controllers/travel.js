/* GET travel view */
const travel = function (req, res) {
    res.render('travel', { title: 'Tavlr Getaways' });
};

module.exports = { travel };
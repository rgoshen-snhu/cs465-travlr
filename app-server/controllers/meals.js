/* GET meals view */
const meals = function (req, res) {
    res.render('meals', { title: 'Travlr Getaways - Meals' });
};

module.exports = { meals };

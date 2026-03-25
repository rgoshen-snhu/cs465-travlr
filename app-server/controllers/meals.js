const fs = require('fs');

const meals = JSON.parse(fs.readFileSync('./data/meals.json', 'utf-8'));

/* GET meals view */
const mealsHandler = function (req, res) {
    res.render('meals', { title: 'Travlr Getaways - Meals', navPage: 'meals', meals });
};

module.exports = { meals: mealsHandler };

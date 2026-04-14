const mongoose = require('mongoose');
require('../models/meal');
const Meal = mongoose.model('meals');

// GET: /api/meals - return all meals
const mealsList = async (req, res) => {
  try {
    const meals = await Meal.find();
    if (!meals.length) {
      return res.status(404).json({ message: 'No meals found' });
    }
    res.status(200).json(meals);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching meals', error: err.message });
  }
};

module.exports = { mealsList };

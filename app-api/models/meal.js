const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  featured: { type: String }, // name of the featured dish for this category
});

const Meal = mongoose.model('meals', mealSchema);

module.exports = Meal;

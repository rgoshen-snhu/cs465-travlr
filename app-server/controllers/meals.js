const port = process.env.PORT ?? 3000;
const mealsEndpoint = `http://localhost:${port}/api/meals`;
const options = { method: 'GET', headers: { 'Content-Type': 'application/json' } };

/* GET meals view */
const mealsHandler = async function (req, res) {
  let message = null;
  let meals = [];
  try {
    const response = await fetch(mealsEndpoint, options);
    meals = await response.json();
    if (!Array.isArray(meals)) {
      message = 'API lookup error';
      meals = [];
    } else if (meals.length === 0) {
      message = 'No meals found in our database!';
    }
  } catch (error) {
    console.error('Error fetching meals:', error);
    message = 'Unable to load meals at this time.';
  }
  res.render('meals', { title: 'Travlr Getaways - Meals', navPage: 'meals', meals, message });
};

module.exports = { meals: mealsHandler };

const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips');

// Define the route for getting the list of trips
router.get('/trips', tripsController.tripsList);

// Define the route for getting a specific trip by code
router.get('/trips/:tripCode', tripsController.tripsFindByCode);

module.exports = router;
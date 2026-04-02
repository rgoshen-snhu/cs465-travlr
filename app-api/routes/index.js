const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips');

// Define the route for getting the list of trips
router.get('/trips', tripsController.tripsList);

module.exports = router;
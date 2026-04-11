const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips');

// Define the route for getting the list of trips
router
    .route('/trips')
    .get(tripsController.tripsList) // GET: /trips - get a list of all trips
    .post(tripsController.tripsAddTrip); // POST: /trips - create a new trip (not implemented yet)

// Define the route for getting a specific trip by code
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode) // GET: /trips/:tripCode - get a specific trip by code
    .put(tripsController.tripsUpdateTrip); // PUT: /trips/:tripCode - update a specific trip by code (not implemented yet)

module.exports = router;
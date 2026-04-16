const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');
const roomsController = require('../controllers/rooms');
const mealsController = require('../controllers/meals');
const newsController = require('../controllers/news');
const homeController = require('../controllers/home');
const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens

// Middleware to authenticate the JWT token on protected routes
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.error('Authorization header missing');
        return res.sendStatus(401);
    }

    const parts = authHeader.split(' ');
    if (parts.length < 2) {
        console.error('Malformed Authorization header: ' + authHeader);
        return res.sendStatus(401);
    }

    const token = parts[1];
    if (!token) {
        console.error('Bearer token missing');
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT verification failed:', err.message);
            return res.sendStatus(401);
        }
        req.auth = decoded;
        next();
    });
};


// Define the route for user registration and login
router.route('/register')
    .post(authController.register); // POST: /register - register a new user
router.route('/login')
    .post(authController.login); // POST: /login - login a user

// Define the route for getting the list of trips
router
    .route('/trips')
    .get(tripsController.tripsList) // GET: /trips - get a list of all trips
    .post(authenticateJWT, tripsController.tripsAddTrip); // POST: /trips - create a new trip (JWT required)

// Define the route for getting a specific trip by code
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode) // GET: /trips/:tripCode - get a specific trip by code
    .put(authenticateJWT, tripsController.tripsUpdateTrip); // PUT: /trips/:tripCode - update a specific trip by code (JWT required)

// Public content routes
router.route('/rooms').get(roomsController.roomsList);
router.route('/meals').get(mealsController.mealsList);
router.route('/news').get(newsController.newsList);
router.route('/home').get(homeController.homeContent);

module.exports = router;
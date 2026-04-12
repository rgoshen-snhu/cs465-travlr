const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');
const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens

// Method to authenticate the JWT token
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader === null) {
        console.error('Auth Header Required but NOT PRESENT!');
        return res.sendStatus(401);
    }

    let headers = authHeader.split(' ');
    if (headers.length < 1) {
        console.error('Not enough tokens in Auth Header: ' + headers.length);
        return res.sendStatus(501);
    }

    const token = authHeader.split(' ')[1];

    if (token === null) {
        console.error('NULL Bearer Token');
        return res.sendStatus(401);
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if (err) return res.sendStatus(401).json('Token Validation Error!');
        req.auth = verified;
        next();
    });
}


// Define the route for user registration and login
router.route('/register')
    .post(authController.register); // POST: /register - register a new user
router.route('/login')
    .post(authController.login); // POST: /login - login a user

// Define the route for getting the list of trips
router
    .route('/trips')
    .get(tripsController.tripsList) // GET: /trips - get a list of all trips
    .post(authenticateJWT, tripsController.tripsAddTrip); // POST: /trips - create a new trip (not implemented yet)

// Define the route for getting a specific trip by code
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode) // GET: /trips/:tripCode - get a specific trip by code
    .put(authenticateJWT, tripsController.tripsUpdateTrip); // PUT: /trips/:tripCode - update a specific trip by code (not implemented yet)

module.exports = router;
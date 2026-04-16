const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer');

router.get('/my-trips', customerController.myTrips);
router.get('/book/:tripCode', customerController.bookTrip);

module.exports = router;

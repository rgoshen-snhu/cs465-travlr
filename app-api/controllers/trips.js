const mongoose = require('mongoose');
const Trip = require('../models/travlr');  // register the model
const Model = mongoose.model('trips'); // retrieve the model for use


// GET: /trips - get a list of all trips
// Regardless of outcomes, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
    try {
        const tripsList = await Model.find(); // returns all records, no filter applied

        console.log(tripsList); // DEBUG: remove me after confirming data is being retrieved correctly
        if (!tripsList) {
            // If no trips are found, return a 404 status with a message
            return res.status(404).json({ message: 'No trips found' });
        }
        res.status(200).json(tripsList); // If trips are found, return them with a 200 status
    } catch (err) {
        res.status(500).json({ message: 'Error fetching trips', error: err });
    }
};

// GET: /trips/:tripCode - get a specific trip by code
// Regardless of outcomes, response must include HTML status code
// and JSON message to the requesting client
const tripsFindByCode = async (req, res) => {
    try {
        const trip = await Model.findOne({ code: req.params.tripCode });

        console.log(trip); // DEBUG: remove me after confirming data is being retrieved correctly
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        res.status(200).json(trip);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching trip', error: err });
    }
};

module.exports = {
    tripsList,
    tripsFindByCode
};
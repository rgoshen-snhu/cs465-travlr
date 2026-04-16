const mongoose = require('mongoose');
const Trip = require('../models/travlr');  // register the model
const Model = mongoose.model('trips'); // retrieve the model for use


// GET: /trips - get a list of all trips
// Regardless of outcomes, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
    try {
        const tripsList = await Model.find(); // returns all records, no filter applied

        if (!tripsList) {
            // If no trips are found, return a 404 status with a message
            return res.status(404).json({ message: 'No trips found' });
        }
        res.status(200).json(tripsList); // If trips are found, return them with a 200 status
    } catch (err) {
        res.status(500).json({ message: 'Error fetching trips', error: err });
    }
};

// POST: /trips - create a new trip
// Regardless of outcomes, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async (req, res) => {
    const newTrip = new Trip({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
    });

    try {
        const savedTrip = await newTrip.save();
        if (!savedTrip) {
            return res.status(400).json({ message: 'Failed to save trip' });
        } else {
            res.status(201).json(savedTrip);
        }
    } catch (err) {
        res.status(400).json({ message: 'Error creating trip', error: err });
    }

};

// GET: /trips/:tripCode - get a specific trip by code
// Regardless of outcomes, response must include HTML status code
// and JSON message to the requesting client
const tripsFindByCode = async (req, res) => {
    try {
        const trip = await Model.findOne({ code: req.params.tripCode });

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        res.status(200).json(trip);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching trip', error: err });
    }
};

// PUT: /trips/:tripCode - update a specific trip by code
// Regardless of outcomes, response must include HTML status code
// and JSON message to the requesting client

const tripsUpdateTrip = async (req, res) => {
    try {
        const updatedTrip = await Model.findOneAndUpdate(
            { code: req.params.tripCode },
            {
                'code': req.body.code,
                'name': req.body.name,
                'length': req.body.length,
                'start': req.body.start,
                'resort': req.body.resort,
                'perPerson': req.body.perPerson,
                'image': req.body.image,
                'description': req.body.description
            },
            { new: true }
        );

        if (!updatedTrip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        res.status(200).json(updatedTrip);
    } catch (err) {
        res.status(400).json({ message: 'Error updating trip', error: err });
    }
};

module.exports = {
    tripsList,
    tripsAddTrip,
    tripsFindByCode,
    tripsUpdateTrip
};
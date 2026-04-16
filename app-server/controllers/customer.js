/* GET /my-trips — placeholder for customer itinerary view */
const myTrips = (req, res) => {
    res.render('my-trips', {
        title: 'My Trips',
        navPage: 'my-trips',
    });
};

/* GET /book/:tripCode — placeholder for trip booking view */
const bookTrip = (req, res) => {
    res.render('book-trip', {
        title: 'Book a Trip',
        navPage: 'travel',
        tripCode: req.params.tripCode,
    });
};

module.exports = { myTrips, bookTrip };

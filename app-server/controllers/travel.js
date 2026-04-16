const port = process.env.PORT ?? 3000; // get the port from environment variable or default to 3000
const tripsEndpoint = `http://localhost:${port}/api/trips`;
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

// const fs = require('fs');

// const trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf-8'));

/* GET travel view */
const travel = async function (req, res) {
    let message = null;
    try {
        const response = await fetch(tripsEndpoint, options);
        let trips = await response.json();
        if (!Array.isArray(trips)) {
            message = 'API lookup error';
            trips = [];
        } else if (trips.length === 0) {
            message = 'No trips exist in our database!';
        }
        res.render('travel', { title: 'Tavlr Getaways', navPage: 'travel', trips, message });
    } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).send('Error fetching trips');
    }
};

/* GET single trip detail view */
const tripDetail = async function (req, res) {
    const { tripCode } = req.params;
    try {
        const response = await fetch(`${tripsEndpoint}/${tripCode}`, options);
        if (!response.ok) {
            return res.status(404).render('error', { message: 'Trip not found', error: { status: 404 } });
        }
        const trip = await response.json();
        res.render('trip-detail', { title: trip.name, navPage: 'travel', trip });
    } catch (error) {
        console.error('Error fetching trip detail:', error);
        res.status(500).send('Error fetching trip detail');
    }
};

module.exports = { travel, tripDetail };
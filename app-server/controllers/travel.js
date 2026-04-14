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

module.exports = { travel };
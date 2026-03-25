// Bring in the DB connection adn the Trip schema
const mongoose = require('./db');
const Trip = require('./travlr');

// Read in the data from the JSON file
const fs = require('fs');
const tripData = JSON.parse(fs.readFileSync('./data/trips.json', 'utf-8'));

// delete any existing records, then insert the seed data
const seedDB = async () => {
    await Trip.deleteMany({});
    await Trip.insertMany(tripData);
    console.log("Database seeded!");
};

// Close the DB connection and exit
seedDB().then(() => {
    mongoose.connection.close();
    process.exit(0);
});
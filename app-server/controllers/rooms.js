const fs = require('fs');

const rooms = JSON.parse(fs.readFileSync('./data/rooms.json', 'utf-8'));

/* GET rooms view */
const roomsHandler = function (req, res) {
    res.render('rooms', { title: 'Travlr Getaways - Rooms', rooms });
};

module.exports = { rooms: roomsHandler };

const port = process.env.PORT ?? 3000;
const roomsEndpoint = `http://localhost:${port}/api/rooms`;
const options = { method: 'GET', headers: { 'Content-Type': 'application/json' } };

/* GET rooms view */
const roomsHandler = async function (req, res) {
  let message = null;
  let rooms = [];
  try {
    const response = await fetch(roomsEndpoint, options);
    rooms = await response.json();
    if (!Array.isArray(rooms)) {
      message = 'API lookup error';
      rooms = [];
    } else if (rooms.length === 0) {
      message = 'No rooms found in our database!';
    }
  } catch (error) {
    console.error('Error fetching rooms:', error);
    message = 'Unable to load rooms at this time.';
  }
  res.render('rooms', { title: 'Travlr Getaways - Rooms', navPage: 'rooms', rooms, message });
};

module.exports = { rooms: roomsHandler };

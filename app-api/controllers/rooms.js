const mongoose = require('mongoose');
require('../models/room');
const Room = mongoose.model('rooms');

// GET: /api/rooms - return all rooms
const roomsList = async (req, res) => {
  try {
    const rooms = await Room.find();
    if (!rooms.length) {
      return res.status(404).json({ message: 'No rooms found' });
    }
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching rooms', error: err.message });
  }
};

module.exports = { roomsList };

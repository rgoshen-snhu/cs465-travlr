/* GET rooms view */
const rooms = function (req, res) {
    res.render('rooms', { title: 'Travlr Getaways - Rooms' });
};

module.exports = { rooms };

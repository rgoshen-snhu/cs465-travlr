/* GET contact view */
const contact = function (req, res) {
    res.render('contact', { title: 'Travlr Getaways - Contact' });
};

module.exports = { contact };

/* GET contact view */
const contact = function (req, res) {
    res.render('contact', { title: 'Travlr Getaways - Contact', navPage: 'contact' });
};

module.exports = { contact };

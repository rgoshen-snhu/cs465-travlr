const fs = require('fs');

const contact = JSON.parse(fs.readFileSync('./data/contact.json', 'utf-8'));

/* GET contact view */
const contactHandler = function (req, res) {
    res.render('contact', { title: 'Travlr Getaways - Contact', contact });
};

module.exports = { contact: contactHandler };

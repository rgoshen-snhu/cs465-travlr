const express = require('express');
const router = express.Router();

const controller = require('../controllers/travel');

/* GET travel page. */
router.get('/', controller.travel);

/* GET single trip detail page. */
router.get('/:tripCode', controller.tripDetail);

module.exports = router;

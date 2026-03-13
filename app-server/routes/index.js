const express = require('express');
const router = express.Router();

const cntrlMain = require('../controllers/main');

/* GET home page. */
router.get('/', cntrlMain.index);

module.exports = router;

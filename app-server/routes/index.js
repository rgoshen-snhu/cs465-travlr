const express = require('express');
const router = express.Router();

const cntrlMain = require('../controllers/cntlrMain');

/* GET home page. */
router.get('/', cntrlMain.home);

module.exports = router;

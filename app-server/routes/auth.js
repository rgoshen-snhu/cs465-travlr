const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/login', authController.loginPost);
router.post('/signup', authController.signupPost);
router.get('/logout', authController.logout);

module.exports = router;

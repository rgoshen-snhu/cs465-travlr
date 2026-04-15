const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/login', authController.loginGet);
router.post('/login', authController.loginPost);
router.get('/signup', authController.signupGet);
router.post('/signup', authController.signupPost);
router.get('/logout', authController.logout);

module.exports = router;

const mongoose = require('mongoose');
const User = require('../models/user');
const passport = require('passport');

const register = async (req, res) => {
    // Validate message to insure all parameters are present
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const user = new User({
        name: req.body.name, // Set User name
        email: req.body.email, // Set User email
        password: '' // Start with empty password
    });

    user.setPassword(req.body.password); // Set user password
    const response = await user.save();

    if (!response) {
        // Database return no user
        return res.status(400).json(err);
    } else {
        // Return new user token
        const token = user.generateJWT();
        return res.status(200).json(token);
    }
}

const login = async (req, res) => {
    // Validate message to insure email and password are present
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Delegate authenitcation to passport module
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            // Error in Authentication Process
            return res.status(404).json(err);
        }
        if (user) {
            // Auth succeeded - generate JWT and return to caller
            return res.status(200).json({ token: user.generateJWT() });
        } else {
            // Auth failed return error
            return res.status(401).json(info);
        }
    })(req, res);
}

module.exports = {
    register,
    login
}
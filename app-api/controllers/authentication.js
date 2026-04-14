const User = require('../models/user');
const passport = require('passport');

const register = async (req, res) => {
    // Ensure all required fields are present
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
    });

    user.setPassword(req.body.password);
    const response = await user.save();

    if (!response) {
        return res.status(400).json({ message: 'Failed to save user' });
    }

    // Return token in same shape as login for consistent API contract
    return res.status(200).json({ token: user.generateJWT() });
}

const login = async (req, res) => {
    // Ensure email and password are present
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Delegate authentication to passport module
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            // Unexpected error during authentication process
            return res.status(500).json({ message: 'Authentication error' });
        }
        if (user) {
            // Auth succeeded — generate JWT and return to caller
            return res.status(200).json({ token: user.generateJWT() });
        }
        // Auth failed — return passport info message
        return res.status(401).json(info);
    })(req, res);
}

module.exports = {
    register,
    login
}
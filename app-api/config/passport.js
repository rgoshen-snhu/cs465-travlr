const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Users = require('../models/user');
const User = mongoose.model('users');

passport.use(new LocalStrategy({
    usernameField: 'email', // Use email instead of username
}, async (username, password, done) => {
    const user = await User.findOne({ email: username });
    if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
    }
    if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
}));
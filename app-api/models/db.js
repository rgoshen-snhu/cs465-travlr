const mongoose = require('mongoose');

// Falls back to local MongoDB so the app runs without env config during development
const host = process.env.DB_HOST || '127.0.0.1:27017';
const dbURI = `mongodb://${host}/travlr`;

const readLine = require('readline');

const connect = () => {
    setTimeout(() => {
        mongoose.connect(dbURI);
    }, 1000); // Retry after 1 second if initial connection fails
}

// Monitor connection lifecycle to aid debugging connectivity issues in production
mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// SIGINT is sent on Ctrl+C — clean up before exiting (windows specific)
if (process.platform === 'win32') {
    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('SIGINT', () => {
        process.emit('SIGINT');
    });
}

// Ensures the DB connection is properly closed before the process exits,
// preventing data corruption and connection pool leaks
const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
        console.log(`Mongoose disconnected through ${msg}`);
        callback();
    });
};

// SIGUSR2 is sent by nodemon on restart — use `once` so the handler
// doesn't persist across restarts and re-register on the new process
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// SIGINT is sent on Ctrl+C — use `once` so the handler doesn't persist across restarts and re-register on the new process
process.once('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});

// SIGTERM is sent by Heroku when the app is shutting down — use `once` so the handler
// doesn't persist across restarts and re-register on the new process
process.once('SIGTERM', () => {
    gracefulShutdown('app shutdown', () => {
        process.exit(0);
    });
});

connect();

// Bring in the Mongoose models
require('./travlr');
require('./room');
require('./meal');
require('./newsarticle');
require('./homecontent');
require('./user');
module.exports = mongoose;

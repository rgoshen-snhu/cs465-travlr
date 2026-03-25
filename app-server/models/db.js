const mongoose = require('mongoose');

// Falls back to local MongoDB so the app runs without env config during development
const dbURI = process.env.DB_URI || 'mongodb://localhost:27017/travlr';

mongoose.connect(dbURI);

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

// SIGINT is sent on Ctrl+C — clean up before exiting
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});

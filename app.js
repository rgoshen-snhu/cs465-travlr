const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('dotenv').config();

// Bring in the database connection, which also registers the Mongoose models
require('./app-api/models/db');

const indexRouter = require('./app-server/routes/index');
const usersRouter = require('./app-server/routes/users');
const travelRouter = require('./app-server/routes/travel');
const roomsRouter = require('./app-server/routes/rooms');
const mealsRouter = require('./app-server/routes/meals');
const newsRouter = require('./app-server/routes/news');
const aboutRouter = require('./app-server/routes/about');
const contactRouter = require('./app-server/routes/contact');
const apiRouter = require('./app-api/routes/index');
const handlebars = require('hbs');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app-server', 'views'));
// Register the partials directory with Handlebars (https://npmjs.com/package/hbs)
handlebars.registerPartials(path.join(__dirname, 'app-server', 'views', 'partials'));
// Custom Handlebars helper: {{#if (eq navPage 'travel')}}
// Handlebars has no built-in equality check, so this helper lets templates
// compare two values. Used in header.hbs to highlight the active nav item.
handlebars.registerHelper('eq', (a, b) => a === b);

app.set('view engine', 'hbs');
app.set('view options', { layout: 'layouts/layout' });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); // Adjust this to your Angular app's URL
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow necessary headers
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow necessary HTTP methods
  next();
});

// Wireup routes to controllers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);
app.use('/rooms', roomsRouter);
app.use('/meals', mealsRouter);
app.use('/news', newsRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

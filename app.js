// Require dotenv if not prod
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// import routes for catalog area of site
const catalogRouter = require('./routes/catalog.js');

var app = express();

// import database init scripts
const initTables = require('./db/populateDB');
const populateData = require('./db/populateData.js');

// attempt to populate database
const initializeDatabase = async () => {
    try {
        // Run init scripts
        await initTables();
        await populateData();
    } catch (error) {
        console.error('Error during database initialization', error);
    }
};

initializeDatabase()
    .then(() => {
        console.log('Database initialized and populated succesfully!');
    })
    .catch((err) => {
        console.error('Failed to initialize and populate database', err);
    });

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
            ],
            'script-src': [
                "'self'",
                "'unsafe-inline'",
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
                'code.jquery.com',
                'cdn.jsdelivr.net',
            ],
            fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'], // Allow fonts from Google Fonts and data: scheme
            imgSrc: ["'self'"],
        },
    })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// compress all routes
app.use(compression());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// add catalog to middleware stack
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    console.log('error trigger');
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

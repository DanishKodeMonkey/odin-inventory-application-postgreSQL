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

// Mongoose connection to db
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// fetch credentials from .env excluded from git.
const mongoDB = process.env.MONGO_URI;

// log any errors
main().catch(err => console.log(err));

// establis hconnection
async function main() {
    await mongoose.connect(mongoDB);
}
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

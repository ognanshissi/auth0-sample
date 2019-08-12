const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

var userInViews = require('./lib/middleware/userInViews');

// routes
var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// session config
const sess = {
    secret: process.env.SECRET_KEY,
    cookie: {},
    resave: false,
    saveUninitialized: true
}

if (app.get('env') === 'production') {
    sess.cookie.secure = true; // serve secure cookies, requires https
}

// view setup
app.engine('ejs', ejs.__express)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json()) // parse incoming request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sess));


// load auth0 config
require('./auth0');

app.use(passport.initialize())
app.use(passport.session());

app.use(userInViews()); // make user available in views
app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/', usersRouter);

app.listen(3000);
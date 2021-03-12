var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()
var passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
const passportJwt = require("passport-jwt");
const JWTStrategy   = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
var User = require('./models/userModel');
const bcrypt = require("bcryptjs");


var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();


//Mongoose

//Import the mongoose module
var mongoose = require('mongoose');
var mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Passport login middleware
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
         // passwords match! log user in
           
           return done(null, user)
         } else {
           // passwords do not match!
           return done(null, false, {msg: "Incorrect password"})
     }
})
      return done(null, user);
    });
  }
));

// Jwt Passport  midldleware

var opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY; 

passport.use(new JWTStrategy(opts, function (jwt_payload, done) {
         User.findById(jwt_payload.id, function(err, user) {
           if (err) {
             console.log('failure')
             return done(err, false)
           }
           if (user.status == 'admin') {
             console.log('successs')
             return done(null,user) 
           }
           else {
             return done(null,false)
           }
         })
          
    }));




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/blogs', indexRouter);
app.use('/admin', passport.authenticate('jwt', {session: false}), adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

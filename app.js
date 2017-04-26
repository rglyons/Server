global.Models = require("./server/models");
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
//passport and local Strategy
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
//setup passport local Strategy
passport.use(new Strategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        console.log("err ", err);
        return done(err);
      } if (!user) {
        console.log("no user, !user");
        return done(null, false, { message: 'Incorrect username.' });
      } if (!user.validPassword(password)) {
        console.log("wrong password");
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log("success, found a user");
      return done(null, user);
    });
  }
));

//serialize and deserialize users with passport
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});




// Set up the express app
const app = express();
const port = process.env.PORT;
app.use(cors());
// Log requests to the console.
app.use(logger('dev'));
app.use('/bower_components', express.static(__dirname + '/bower_components'))
app.use("/static", express.static(__dirname + '/static'));
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require('express-session')({ secret: 'keyboard cat'}));
// Initialize Passport and restore authentication state, from the session
app.use(passport.initialize());
app.use(passport.session());

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

//login using passport-local
app.post('/',
  passport.authenticate('local', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

//webapp hosting stuff
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/login.html');
});
app.get('/index.html', isAuthenticated, (req,res) =>{
  res.sendFile(__dirname + '/index.html');
});
// Require our routes into the application.
require('./server/routes')(app);
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));


app.listen(port);
console.log("Listening to port: " + port);

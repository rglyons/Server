global.Models = require("./server/models");
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./server/models').User;

//passport and local Strategy
// const passport = require('passport');
// const Local = require('passport-local').Strategy;
//setup passport local Strategy

// var findByUsername = function(username, password, cb) {
//   console.log("passport local login initialized");
//   process.nextTick(function() {
//     User.findOne({ where: {username: username}})
//     .then(function (user) {
//       console.log(JSON.stringify(user));
//       console.log("found user", user.username);
//       //on wrong password
//       if(user.password !=password){return cb(null, false)}
//       //on right password
//       return cb(null, user);
//     })
//     .error(function(err){
//       return cb(null, null);
//     })
//   });
// }


/*
/ passport authentication begins with login here
*/
// passport.use(new Local(
//   function(username, password, done) {
//     console.log("logging in with passport");
//     console.log(username);
//     console.log(password);
//     return findByUsername(username, password, done);
//       })
// );

//serialize and deserialize users with passport
// passport.serializeUser(function(user, cb) {
//   console.log("serialize user");
//   console.log(JSON.stringify(user));
//   cb(null, user.id);
// });
//
// passport.deserializeUser(function(id, cb) {
//   console.log("DEserialize user");
//   console.log(id);
//   User.findById(id)
//   .then( function(user){
//     cb(null, user)
//   })
//   .error(function (err) {
//    cb(err)
//   });
// });

// Set up the express app
const app = express();
const port = process.env.PORT;
app.use(cors());
// Log requests to the console.
app.use(logger('dev'));
app.use('/bower_components', express.static(__dirname + '/bower_components'))
app.use("/static", express.static(__dirname + '/static'));
app.use('/newUI', express.static(__dirname + '/newUI'))
app.use("/AboutUs", express.static(__dirname + '/AboutUs'));
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require('express-session')({
  secret: 'a random string of garbo',
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport and restore authentication state if needed, from the session
// app.use(passport.initialize());
// app.use(passport.session());

// var isAuthenticated = function (req, res, next) {
// 	if (req.isAuthenticated())
// 		return next();
// 	res.redirect('/');
// }

//login using passport-local
// app.post('/',
//   passport.authenticate('local', {
//     failureRedirect: '/',
//     failureFlash: true
//   }),
//   function(req, res) {
//     console.log("form submitted");
//     res.redirect('/index.html');
//   }
// );

app.post('/', (req, res)=>{
  res.redirect('index.html');
})

//webapp hosting stuff
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/login.html');
});
app.get('/index.html', /*isAuthenticated,*/ (req,res) =>{
  res.sendFile(__dirname + '/index.html');
});
// Require our routes into the application.
require('./server/routes')(app);
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));


app.listen(port);
console.log("Listening to port: " + port);

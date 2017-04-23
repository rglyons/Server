global.Models = require("./server/models");
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

// Set up the express app
const app = express();
const port = process.env.PORT;

// Log requests to the console.
app.use(logger('dev'));
app.use('/bower_components', express.static(__dirname + '/bower_components'))
app.use("/static", express.static(__dirname + '/static'));
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//webapp hosting stuff
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/login.html');
});
app.get('/index.html',(req,res) =>{
  res.sendFile(__dirname + '/index.html');
});
// Require our routes into the application.
require('./server/routes')(app);
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));


app.listen(port);
console.log("Listening to port: " + port);

global.Models = require('./server/models')
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const nodemailer = require('nodemailer')
const cors = require('cors')
const User = require('./server/models').User
const auth = require('./server/auth').auth

// Set up the express app
const app = express()
const port = process.env.PORT
global.appPath = __dirname
app.use(cors())
// Log requests to the console.
app.use(logger('dev'))
app.use('/static', express.static(__dirname + '/frontend/login/static'))
app.use('/frontend/dist', express.static(__dirname + '/frontend/dist'))
app.use('/frontend/AboutUs', express.static(__dirname + '/frontend/AboutUs'))
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

/*
  Here we are configuring our SMTP Server details.
  STMP is mail server which is responsible for sending and recieving email.
*/
global.smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
      user: "slugsense",
      pass: "tylersucks!"
    }
});

// app.post('/', (req, res) => {
//   res.redirect('/index.html')
// })

// webapp hosting stuff
// app.get('/', (req, res) => {
//   // console.log('Cookies: ', req.cookies)
//   if (req.cookies.token)
//     res.sendFile(__dirname + '/frontend/index.html')
//   else
//     res.sendFile(__dirname + '/frontend/login/login.html')
// })
app.get('/', auth.validateLogin, (req, res) => {
  console.log('COMING INTO MY PLACE!!!!!!!!!!!!!!!!!!!!!!')
  if (req.user){
    console.log('in ')
    res.sendFile(__dirname + '/frontend/index.html')
}else{
    console.log('out ')
    res.sendFile(__dirname + '/frontend/login/login.html')
}
})

app.get('/sent_email', (req, res) => {
  res.sendFile(__dirname + '/frontend/sent_email.html')
})

// Require our other routes into the application.
require('./server/routes')(app)
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.'
}))

app.listen(port)
console.log('Listening to port: ' + port)

module.exports = app

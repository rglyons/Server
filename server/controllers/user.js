const User = require('../models').User;
const Node = require('../models').Node;
const randomstring = require("randomstring")

var newUsers = {}   // table of users that are creating/verifying accounts at any moment
                    // this will allow many users to create and verify their accounts simultaneously

function sendVerificationEmail(req, res, user) {
  let rand = randomstring.generate(15)  // unique 15-character verification id
  let host = req.get('host')
  link="http://"+host+"/api/verify?id="+rand;
  user.host = host
  newUsers[rand] = user   // so we can look up this user from the verification URL
  mailOptions={
      from: 'slugsense@gmail.com',
      to : user.email,
      subject : "SlugSense Do Not Reply - Verify Your Email",
      html : "Hello from SlugSense!<br> Please click on this link to verify your email.<br><a href="+link+">verify email</a>" 
  }
  smtpTransport.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err);
      return res.status(400).send(err);
    } else {
      result = {
        envelope: info.envelope,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response
      }
      console.log("Email successfully sent to " + result.accepted);
      return res.status(200).send(result)
    }
  });
}

module.exports = {
  initNewUser(req, res) {
    let user = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      nodeCount: 0 
    }
    return sendVerificationEmail(req, res, user)
  },
  
  verifyUserEmail(req, res) {
    let user = newUsers[req.query.id]   // find user that wants to be verified
    if (!user) {
      return res.status(400).send('Bad verification id! Cannot verify email.');
    } else if (req.protocol+"://"+req.get('host') != "http://"+user.host) {
      return res.status(400).send('Request is from an unknown source/domain! Cannot verify email.');
    } else {
      // create user and remove record from newUser table
      return User
        .create({
          username: user.username,
          password: user.password,
          email: user.email,
          nodeCount: 0,
        })
        .then(user => {
            delete newUsers[req.query.id]   // remove created user from list of users in creation limbo
            user.password = null 
            // login user (set cookies, redirect)
            var tenSeconds = 1 / (24 * 60 * 6)
            res.cookie('token', user.api_token, {maxAge: tenSeconds})
            //res.status(201).send(user)
            //res.sendFile('/frontend/index.html', {root: './'})
          }
        )
        .catch(error => {
          console.log(error)
          res.status(400).send(error)
        });
    }
  },
  
  create(req, res) {
    return User
      .create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        nodeCount: 0,
      })
      .then(user => {
          user.password = null 
          res.status(201).send(user)
        }
      )
      .catch(error => res.status(400).send(error));
  },
    
  getUser(req, res) {
    response = {}
    response["id"] = req.user.id
    response["username"] = req.user.username
    response["email"] = req.user.email
    response["nodeCount"] = req.user.nodeCount
    response["nodes"] = req.user.nodes
    return res.status(200).send(response);
  },
  
  generateApiToken(req, res) {
    return req.user
      .update({
        api_token: randomstring.generate(30)
      })
      .then((user) => {
        user.password = null 
        res.status(200).send(user)  // Send back the updated user.
      })
      .catch((error) => res.status(400).send(error));
  },
  
  update(req, res) {
    return req.user
      .update({
        password: req.body.password || req.user.password,
        username: req.body.username || req.user.username,
        email: req.body.email || req.user.email,
      })
      .then(user => {
        user.password = null;
        res.status(200).send(user);  // Send back the updated user.
      })
      .catch((error) => res.status(400).send(error));
  },
  
  destroy(req, res) {
    return req.user
      .destroy()
      .then(() => res.status(204).send())
      .catch(error => res.status(400).send(error));
  }  
};
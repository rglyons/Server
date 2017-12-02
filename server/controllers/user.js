const User = require('../models').User
const Node = require('../models').Node
const randomstring = require('randomstring')

var newUsers = {}   // table of users that are creating/verifying accounts at any moment
                    // this will allow many users to create and verify their accounts simultaneously

var pwdrcvUsers = {}  // table of users that are recovering their passwords at any moment

function sendVerificationEmail (req, res, user) {
  let rand = randomstring.generate(15)  // unique 15-character verification id
  let host = req.get('host')
  link = 'http://' + host + '/api/verify?id=' + rand
  user.host = host
  newUsers[rand] = user   // so we can look up this user from the verification URL
  mailOptions = {
    from: 'contact@sproutlabs.io',
    to: user.email,
    subject: 'SproutLabs Do Not Reply - Verify Your Email',
    html: '<div style="word-wrap:break-word; font-family:Helvetica,Arial; width: 400px; border: 0.5px solid gray; padding: 8px; border-radius: 5px;">\
            <div>\
                <div>\
                    <div style="text-align:left;border-radius:5px">\
                        <img src="http://sproutlabs.herokuapp.com/static/images/sproutlabsLogo_v2.png" width="300px">\
                    </div>\
                    <br>\
                    <div style="padding:0px 10px 10px 10px">\
                        <div style="font-size:24px">\
                            Hi ' + user.firstname + '!\
                        </div>\
                        <br>\
                        <div style="font-size:16px">\
                            Thank you for signing up with SproutLabs.\
                        </div>\
                        <div style="font-size:16px">\
                            Please verify your account with the following link.\
                        </div>\
                        <br>\
                        <br>\
                        <div>\
                            <font face="Open Sans">\
                                <a href="' + link + '"\
                                 style="text-align:center;border:1px solid rgb(29,161,242);border-top-left-radius:20px;border-top-right-radius:20px;\
                                 border-bottom-right-radius:20px;border-bottom-left-radius:20px;color:rgb(29,161,242);display:inline-block;\
                                 font-family:&#39;Open Sans&#39;,Verdana,Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;\
                                 line-height:30px;text-decoration:none;width:120px" target="_blank">Verify</a>\
                            </font>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>'
  }
  smtpTransport.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err)
      delete newUsers[rand]   // remove temp user to the temp table doesn't get cluttered
      return res.status(400).send(err)
    } else {
      result = {
        envelope: info.envelope,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response
      }
      console.log('Email successfully sent to ' + result.accepted)
      return res.status(200).send(result)
    }
  })
}

function sendPasswordRecoveryEmail (req, res, user) {
  let rand = randomstring.generate(15)  // unique 15-character verification id
  let host = req.get('host')
  link = 'http://' + host + '/api/reset_pwd?id=' + rand
  user.host = host
  pwdrcvUsers[rand] = user   // so we can look up this user from the reset password URL
  mailOptions = {
    from: 'contact@sproutlabs.io',
    to: user.email,
    subject: 'SproutLabs Do Not Reply - Reset Your Password',
    html: 'Hello from SproutLabs!<br> Please click on this link to reset your password.<br><a href=' + link + '>reset password</a>'
  }
  smtpTransport.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err)
      return res.status(400).send(err)
    } else {
      result = {
        envelope: info.envelope,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response
      }
      console.log('Email successfully sent to ' + result.accepted)
      return res.status(200).send(result)
    }
  })
}

module.exports = {
  initNewUser (req, res) {
    return User
      .findOne({ where: {
        email: req.body.email
/*
        $or: [
          { username: req.body.username },
          { email: req.body.email }
        ]
*/
      }})
    .then(user => {
      if (user) {
        throw new Error('User with email already exists')
      } else {
        let user = {
          username: (req.body.username) ? req.body.username : null,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          password: req.body.password,
          email: req.body.email,
          nodeCount: 0
        }
        return sendVerificationEmail(req, res, user)
      }
    })
    .catch(error => {
      if (error.message == 'User with email already exists') {
        res.status(400).send({
          message: 'User already exists with email = ' + req.body.email + '.'
        })
      } else {
        res.status(400).send(error)
      }
    })
  },

  verifyUserEmail (req, res) {
    let user = newUsers[req.query.id]   // find user that wants to be verified
    if (!user) {
      return res.status(400).send('Bad verification id! Cannot verify email through the requested URL.')
    } else if (req.protocol + '://' + req.get('host') != 'http://' + user.host) {
      return res.status(400).send('Request is from an unknown source/domain! Cannot verify email.')
    } else {
      // create user and remove record from newUser table
      return User
        .create({
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          password: user.password,
          email: user.email,
          nodeCount: 0
        })
        .then(user => {
          delete newUsers[req.query.id]   // remove created user from list of users in creation limbo
          user.password = null
          // login user (set cookies, redirect)
          const tenSeconds = 10000
          res.cookie('token', user.api_token, { maxAge: tenSeconds, httpOnly: false })
          // res.status(201).send(user)
          res.status(201).redirect('/')
        }
        )
        .catch(error => {
          console.log(error)
          res.status(400).send(error)
        })
    }
  },

  recoverPassword (req, res) {
    return User
      .findOne({ where: {
        email: req.body.email
      }})
    .then(user => {
      if (!user) {
        throw new Error('User with that email does not exist!')
      } else {
        // send recovery email
        sendPasswordRecoveryEmail(req, res, user)
      }
    })
    .catch(error => {
      if (error.message == 'User with that email does not exist!') {
        res.status(400).send({
          message: 'User with email ' + req.body.email + ' does not exist.'
        })
      } else {
        res.status(400).send(error)
      }
    })
  },

  resetPassword (req, res) {
    let user = pwdrcvUsers[req.query.id]   // find user that wants a password reset
    if (!user) {
      return res.status(400).send('Bad validation id! Cannot reset password through the requested URL.')
    } else if (req.protocol + '://' + req.get('host') != 'http://' + user.host) {
      return res.status(400).send('Request is from an unknown source/domain! Cannot verify email.')
    } else {
      delete pwdrcvUsers[req.query.id]   // remove created user from list of users in creation limbo
      let fiveMinutes = 300000
      res.cookie('token', user.api_token, { maxAge: fiveMinutes, httpOnly: false })
      res.status(200).redirect('/reset_password')
    }
  },

  create (req, res) {
    return User
      .findOne({ where: {
        email: req.body.email
/*
        $or: [
          { username: req.body.username },
          { email: req.body.email }
        ]
*/
      }})
    .then(user => {
      if (user) {
        throw new Error('User with email already exists')
      } else {
        return User
          .create({
            username: (req.body.username) ? req.body.username : null,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
            email: req.body.email,
            nodeCount: 0
          })
          .then(user => {
            user.password = null
            res.status(201).send(user)
          })
      }
    })
    .catch(error => {
      if (error.message == 'User with email already exists') {
        res.status(400).send({
          message: 'User already exists with email = ' + req.body.email + '.'
        })
      } else {
        res.status(400).send(error)
      }
    })
  },

  getUser (req, res) {
    req.user.password = null // don't send password back to client
    res.status(200).send(req.user)
  },

  generateApiToken (req, res) {
    return req.user
      .update({
        api_token: randomstring.generate(30)
      })
      .then((user) => {
        user.password = null
        res.status(200).send(user)  // Send back the updated user.
      })
      .catch((error) => res.status(400).send(error))
  },

  update (req, res) {
    return req.user
      .update({
        password: req.body.password || req.user.password,
        username: req.body.username || req.user.username,
        email: req.body.email || req.user.email
      })
      .then(user => {
        user.password = null
        res.status(200).send(user)  // Send back the updated user.
      })
      .catch((error) => res.status(400).send(error))
  },

  destroy (req, res) {
    return req.user
      .destroy()
      .then(() => res.status(204).send())
      .catch(error => res.status(400).send(error))
  }
}

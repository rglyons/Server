const User = require('../models').User;
const Node = require('../models').Node;

module.exports = {
  
  login(req, res) {
    return User
      .findOne( { where: 
        { 
          username: req.body.username,
          password: req.body.password,          
        },
        include: [{
          model: Node,
          as: 'nodes',
        }],
        order: [
            [
              {model: Node, as:'nodes'},
              'id'
            ]
        ]
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'Invalid login credentials provided',
          });
        }
        user.password = null // don't send password back to client
        res.status(200).send(user)
      })
      .catch((error) => res.status(400).send(error));
  },
  
  validate(req, res, next) {
    return User
      .findOne( { where: 
        { 
          api_token: req.body.api_token
        },
        include: [{
          model: Node,
          as: 'nodes',
        }],
        order: [
            [
              {model: Node, as:'nodes'},
              'id'
            ]
        ]
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'Invalid API token provided',
          });
        }
        //console.log(user)
        req.user = user
        return next()
      })
      .catch(next)
  }
  
};
const promise = require('bluebird');
const jwtVerify = promise.promisify(require('jsonwebtoken').verify);
const Users = require('../models/users');
module.exports = function () {
  return function (req, res, next) {
    if(req.originalUrl.substring(0,13)=='/api/v1/posts'  && req.method == 'GET'){
      next();
      return
    }
    if(req.originalUrl.substring(0,16)=='/api/v1/comments'  && req.method == 'GET'){
      next();
      return
    }
    if (!req.headers.authorization) {
      res.json({
        "status": {
          "message": "Authorization Header missing",
          "code": 2000
        }
      })
      return
    }
    const token = req.headers.authorization.split(' ')[1];
    jwtVerify(token, req.app.kraken.get('app:jwtSecret')).then(function (decoded) {
      if (!decoded) {
        res.json({
          "status": {
            "message": "Invalid token",
            "code": 2000
          }
        })
        return
      }
      Users.findById(decoded._id).then(function (user) {
        if (!user) {
          res.json({
            "status": {
              "message": "Invalid token",
              "code": 2000
            }
          })
          return
        }
        req.user = user;
        req._id= decoded._id;
        next();
      }).catch(function (err) {
        global.log.error(err);
        res.json({
          "status": {
            "message": "Invalid token",
            "code": 2000
          }
        })
      });
    }).catch(function (err) {
      global.log.error(err);
      res.json({
        "status": {
          "message": "Invalid token",
          "code": 2000
        }
      })
    });
  }
}

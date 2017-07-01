var Users = require('../../../models/users');
var cloudinary = require('../../../lib/cloudinary')();
var uuid = require('uuid-v4');
var graph = require('fbgraph');
var mailer = require('../../../lib/mailer')();
var request = require('request');


var randomstring = require("randomstring");

module.exports = function (router) {

  router.post('/update', function (req, res) {
    console.log("why empty", req.body);
    if (!req.body._id) {
      res.json({
        "status": {
          "message": "missing _id field",
          "code": 2000
        }
      })
      return
    }
    var conditions = {_id: req.body._id}
      , update = {}
      , options = {multi: false};
    req.body.fullName ? update.fullName = req.body.fullName : null;
    req.body.profileImage ? update.profileImage = req.body.profileImage : null;
    Users.update(conditions, update, options, callback);
    function callback(err, numAffected) {
      if (err) {
        res.json({
          "status": {
            "message": err,
            "code": 2000
          }
        })
      } else {
        Users.findOne(conditions).then(function (user) {
          res.json({
            "status": {
              "message": "User updated",
              "code": 1000
            },
            user: user.toClientObject()
          })
        })
      }
    }
  });

  router.post('/forgot-password', function (req, res) {
    if (!req.body.email) {
      res.json({
        "status": {
          "message": "Missing Email",
          "code": 2000
        }
      })
      return
    }
    var email = req.body.email.toLowerCase();
    var code = randomstring.generate(7);

    Users.findOne({email: email}).then(function (user) {
      if (!user) {
        res.json({
          "status": {
            "message": "User not found",
            "code": 2000
          }
        })
        return
      }
      if (user.registrationType && (user.registrationType != 'email')) {
        return res.json({
          "status": {
            "message": "Password cannot be reset. This User is linked with " + user.registrationType,
            "code": 2000
          }
        })

      }
      var newPassword = code;
      user.password = Users.getHashedPassword(newPassword);
      user.save().then(function (user) {
        var usr = user;
        usr.password = code;
        mailer.sendAdminForgotPasswordEmail(usr);
        res.json({
          "status": {
            "message": "Forgot password email sent",
            "code": 1000
          }
        })
      })
    })
  });

  router.post('/register', function (req, res) {
    req.body.password = Users.getHashedPassword(req.body.password);
    var newUser = new Users(req.body);
    Users.findOne({
      email: req.body.email,
    }).then(function (usr) {
      if (!usr) {
        newUser.save()
          .then(function (user) {
            var data = user.toClientObject();
            data.token = user.createAPIToken()
            return res.json({
                "status": "success",
                "user": data,
                "token":data.token
              }
            )
          }).catch(function (err) {
          console.log(err);
          if (err.code === 11000) {
            return res.status(400).json({"status": "error", "message": "email already exists"});
          }
          if (err.name === "ValidationError") {
            return res.status(400).json({"status": "error", "message": err.errors.email.message});

          }
          return res.status(400).json({"status": "error", "message": err});

        });
      }
      else
        return res.status(400).json({"status": "error", "message": "email already exists"});
    })
  });

  router.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    if (!email || !password) {
      return res.status(400).send({status: "error", msg: "missing email or password"}).end();
    }
    Users.findOne({
      email: email,
      password: Users.getHashedPassword(password)
    }).then(function (user) {
      if (!user) {
        return res.status(401).send({status: "error", msg: "invalid email or password"}).end();
      }
      var data = user.toClientObject();
      data.token = user.createAPIToken()
      return res.json({"status": "success", "user": data});
    })
  });

  router.post('/social-login', function (req, res) {
    if (req.body.registrationType == 'facebook') {
      graph.setAccessToken(req.body.token);
      graph
        .get("me?fields=id,name,email,gender,picture.width(800).height(800)", function (err, result) {
          if (err) {
            return res.json({
                "status": {
                  "message": err.message,
                  "code": 2000
                }
              }
            )
          }
          var user = result;
          user.registrationType = 'facebook';
          user.fullName = result.name;
          user.email = result.email || "";
          user.profileImage = result.picture.data.url;
          user.socialToken = result.id;
          processUser(user);
        });
    } else if (req.body.registrationType == 'gmail') {

      request('https://www.googleapis.com/plus/v1/people/me?access_token=' + req.body.token, function (error, response, body) {

        var gData = JSON.parse(body);
        if (gData.error) {
          return res.json({
              "status": {
                "message": gData.error.message,
                "code": 2000,
              }
            }
          )
        } else
          var user = JSON.parse(body);
        user.registrationType = 'gmail';
        user.fullName = gData.displayName;
        user.email = gData.emails ? gData.emails[0].value : "";
        user.profileImage = gData.image.url;
        user.socialToken = user.id;
        processUser(user);
      });

    } else {
      return res.json({
          "status": {
            "message": "Invalid or missing type",
            "code": 2000
          }
        }
      )
    }
    function processUser(usr) {
      Users.findOne({socialToken: usr.socialToken}).then(function (user) {
        if (!user) {
          var newUser = new Users(usr);
          newUser.save()
            .then(function (user) {
              var data = user.toClientObject();
              data.token = user.createAPIToken();
              return res.json({
                  "status": {
                    "message": "Success",
                    "code": 1000
                  },
                  "user": data
                }
              )

            }).catch(function (err) {
            if (err) {
              return res.json({
                  "status": {
                    "message": err,
                    "code": 2000
                  }
                }
              )
            }
          });
        }
        else {
          Users.findByIdAndUpdate(user._id, usr, {new: true}).then(function (user) {
            var data = user.toClientObject();
            data.token = user.createAPIToken();
            return res.json({
              "status": {
                "message": "Success",
                "code": 1000
              },
              "user": data
            });
          });

        }
      })
    }
  });
};

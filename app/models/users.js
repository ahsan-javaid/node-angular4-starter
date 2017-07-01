'use strict';

var mongoose = require('mongoose');

var crypto = require('crypto');
var jwt = require('jsonwebtoken');

function emailValidate(input){
  var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(input);
}


var UsersModel = function() {

  var usersSchema = mongoose.Schema({
      fullName: {type:String},
      email: {type: String, lowercase:true},
      profileImage:{type:String, default:'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png'},
      password: {type:String},
      registrationType: {type: String},
      socialToken:{type:String}
    },
    {collection: 'Users'});

  usersSchema.statics.getUser = function(userId) {
    return this.findOne({_id: userId}).then(function(user) {
      return user;
    });
  };
  usersSchema.statics.getHashedPassword = function (password) {

    return crypto.createHash('sha256').update(password).digest('base64');
  };

  usersSchema.methods.createAPIToken = function () {
    var payload = this.toClientObject();
    return jwt.sign(payload, global.kraken.get('app:jwtSecret'));
  };

  usersSchema.methods.toClientObject = function(){
    var rawObject = this.toObject();
    delete rawObject.password;
    delete rawObject.socialToken;
    delete rawObject.__v;
    return rawObject;
  };


  return mongoose.model('Users', usersSchema);
};

module.exports = new UsersModel();

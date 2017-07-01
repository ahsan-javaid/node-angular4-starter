'use strict';
var mongoose = require('mongoose');

var MenuModel = function() {
  var usersSchema = mongoose.Schema({
    name:{type:String,unique:true}
  }, {collection: 'Menu'});
  return mongoose.model('Menu', usersSchema);
};

module.exports = new MenuModel();

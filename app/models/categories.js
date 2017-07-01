'use strict';
var mongoose = require('mongoose');

var CategoriesModel = function() {
  var usersSchema = mongoose.Schema({
    name:{type:String,unique:true}
  }, {collection: 'Categories'});
  return mongoose.model('Categories', usersSchema);
};

module.exports = new CategoriesModel();

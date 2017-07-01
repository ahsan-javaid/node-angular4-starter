'use strict';
var mongoose = require('mongoose');

var PostsModel = function() {
  var usersSchema = mongoose.Schema({
    title:{type:String,required:true},
    ingredients :{ type:String},
    directions: {type: String},
    shortDescription: {type: String},
    video: {type: String},
    additionalDetails:{type:String},
    picture:{type:String ,required:true},
    create_at:{type:Date,default:Date.now},
    likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}],
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'Users', required:true},
    category:{type: mongoose.Schema.Types.ObjectId, ref: 'Categories' ,required:true},
    comments: [{
      message: {type: String, required: true},
      user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
      date: {type: Date, default: Date.now}
    }]
  }, {collection: 'Posts', toObject: {virtuals: true}, toJSON: {virtuals: true}});

  usersSchema.virtual('likesCount')
    .get(function () {
      return this.likes.length;
    });
  return mongoose.model('Posts', usersSchema);
};

module.exports = new PostsModel();

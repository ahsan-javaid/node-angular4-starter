var _ = require('lodash');
var Users = require('../../../models/users');
var Posts = require('../../../models/posts');

var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function (router) {
  router.post('/', function (req, res) {
    if (!req.body.message || !req.body.postId) {
      return res.status(400).json({status: "error", msg: 'missing fields'});
    }
    let conditions = {_id: req.body.postId};
    let update = {$push: {comments: {user: req.user._id, message: req.body.message}}};
    let options = {multi: false};
    Posts.update(conditions, update, options, function (err, results) {
      if (err) {
        return res.status(400).json({status: "error", msg: err});
      }
      Posts.findOne({_id: req.body.postId})
        .populate('comments.user','-__v')
        .populate('likes','-__v')
        .populate('user','-__v')
        .populate('category','-__v')
        .then((post) => {
          res.json({
            post: post,
            "status": {
              "message": 'success',
              "code": 1000
            }
          })
        });
    });
  });

  router.get('/:id', function (req, res) {
    Posts.findOne({_id: req.params.id})
      .populate('comments.user', '-__v')
      .then((post) => {
        res.json({
          comments: post.comments,
          "status": {
            "message": 'success',
            "code": 1000
          }
        })
      });
  })
};


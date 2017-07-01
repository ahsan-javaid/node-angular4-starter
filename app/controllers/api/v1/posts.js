const Posts = require('../../../models/posts');

module.exports = function (router) {

  router.get('/', function (req, res) {
    let filter = {};
    req.query.categoryId ? filter.category = req.query.categoryId : null;
    req.query.filter && req.query.filter == 'popular' ? filter.$where = function () {
      return this.comments && this.comments.length > 0
    } : null;

    req.query.filter && req.query.filter == 'liked' ? filter.$where = function () {
      return this.likes && this.likes.length > 0
    } : null;

    req.query.liked ? filter.$where = function () {
      return this.likes && this.likes.length > 0
    } : null;
    req.query.liked ? filter.likes = {$in: [req.query.liked]} : null;
    req.query.filter && req.query.filter == 'home' ? filter.$where = function () {
      return true;
    } : null;


    Posts.find(filter, {__v: 0})
      .sort({_id: -1})
      .skip(req.query.offset ? parseInt(req.query.offset) : 0)
      .limit(req.query.limit ? parseInt(req.query.limit) : 0)
      .populate('likes', '-__v')
      .populate('user', '-__v')
      .populate('category', '-__v')
      .populate('comments.user','-__v')
      .then((posts)  => {
        res.json({
          posts: posts,
          "status": {
            "message": 'success',
            "code": 1000
          }
        })
      });
  });

  router.post('/', function (req, res) {
    req.body.user = req.user._id;
    req.body.category = req.body.categoryId;
    Posts.create(req.body)
      .then((post)  => {
        Posts.findOne({_id:post._id},{__v: 0})
          .populate('user', '-__v')
          .populate('category', '-__v')
          .then((post)  => {
            res.json({
              post: post,
              "status": {
                "message": 'success',
                "code": 1000
              }
            })
          });
      }).catch(err=> {
        res.json({
          "error": err,
          "status": {
            "message": "missing fields",
            "code": 2000
          }
        })
      })
  });

  router.put('/', function (req, res) {
    Posts.findByIdAndUpdate(req.body._id,req.body,{new:true}).then((post)  => {
      res.json({
        post: post,
        "status": {
          "message": 'success',
          "code": 1000
        }
      })
    });
  });

  router.delete('/:id', function (req, res) {
    Posts.remove({ _id: req.params.id }).then(function (status) {
      res.json({
        "status": {
          "message": 'success',
          "code": 1000
        }
      })
    })
  });

  router.post('/like', function (req, res) {
    req.body.user = req.user._id;
    var conditions = {_id: req.body.postId, 'likes': {$ne: req.user._id}},
      update = {$push: {likes: req.user._id}},
      options = {multi: false};
    Posts.update(conditions, update, options).then(function (data) {
      return Posts.findOne({_id: req.body.postId})
    }).then(function (post) {
      res.json({
        post: post,
        "status": {
          "message": 'success',
          "code": 1000
        }
      })
    })

  });
  router.post('/unlike', function (req, res) {
    req.body.user = req.user._id;
    var conditions = {_id: req.body.postId},
      update = {$pull: {likes: req.user._id}},
      options = {multi: false};
    Posts.update(conditions, update, options).then(function (data) {
      return Posts.findOne({_id: req.body.postId})
    }).then(function (post) {
      res.json({
        post: post,
        "status": {
          "message": 'success',
          "code": 1000
        }
      })
    })

  });
}

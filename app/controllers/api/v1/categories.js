const Categories = require('../../../models/categories');

module.exports = function (router) {

  router.get('/', function (req, res) {
    Categories.find({},{__v:0}).then((categories)  => {
      res.json({
        categories: categories,
        "status": {
          "message": 'success',
          "code": 1000
        }
      })
    });
  });

  router.post('/', function (req, res) {
    Categories.create(req.body).then((category)  => {
      res.json({
        category: category,
        "status": {
          "message": 'success',
          "code": 1000
        }
      })
    });
  });

  router.put('/', function (req, res) {
    Categories.findByIdAndUpdate(req.body._id,req.body,{new:true}).then((category)  => {
      res.json({
        category: category,
        "status": {
          "message": 'success',
          "code": 1000
        }
      })
    });
  });
}

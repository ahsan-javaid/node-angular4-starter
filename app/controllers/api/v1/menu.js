const Menu = require('../../../models/menu');

module.exports = function (router) {

  router.get('/', function (req, res) {
    Menu.find({},{__v:0,_id:0}).then((menu)  => {
      res.json({
        menu: menu,
        "status": {
          "message": 'success',
          "code": 1000
        }
      })
    });
  });

}

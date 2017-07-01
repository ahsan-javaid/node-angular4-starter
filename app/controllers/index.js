const path = require('path');
const fs = require('fs');
const urljoin = require('url-join');
const _ = require('lodash');
var cloudinary = require('../lib/cloudinary')();


module.exports = function (router) {

  router.post('/cloud/upload', function (req, res) {
    if (!req.files) {
      res.json({
        "status": {
          "message": "No image attached",
          "code": 2000
        }
      })
      return;
    }
    cloudinary.uploadFile(req.files.picture.path).then(function (data) {
      req.body.image = data.url;
      res.json({
        "status": {
          "message": "Success",
          "code": 1000
        },
        "url": data.url
      })
    }, function (err) {
      res.json({
        "status": {
          "message": err,
          "code": 2000
        }
      })
    })
  });


  router.post('/cloud/upload/base64', function (req, res) {
    if (!req.body.picture) {
      res.json({
        "status": {
          "message": "No image attached",
          "code": 2000
        }
      })
      return;
    }
    cloudinary.uploadBase64(req.body.picture).then(function (data) {
      req.body.image = data.url;
      res.json({
        "status": {
          "message": "Success",
          "code": 1000
        },
        "url": data.url
      })
    }, function (err) {
      res.json({
        "status": {
          "message": err,
          "code": 2000
        }
      })
    })
  });

  router.post('/upload', function (req, res) {

    if (req.files.picture) {
      let dir = './uploads';
      let destLocation = dir + '/' + path.basename(req.files.picture.path);

      if (!fs.existsSync(dir)) {
        fs.mkdir(dir);
      }

      let source = fs.createReadStream(req.files.picture.path);
      let dest = fs.createWriteStream(destLocation);

      source.pipe(dest);


      url = urljoin(require('../../config/config.json').app.url, path.basename(req.files.picture.path));

      res.json({
        "status": {
          "message": "Success",
          "code": 1000
        },
        "url": url
      })

    } else {
      res.status(400).json({err: 'no file provided'});
    }

  });

  router.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../../sample-app/dist', 'index.html'));
  });

};

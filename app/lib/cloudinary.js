var fs=require('fs')
var cloudinary = require('cloudinary');
var uuid = require('uuid-v4');
var cloudinaryConfiguration = require('../../config/config.json').cloudinary;
cloudinary.config(cloudinaryConfiguration);
var Q = require('q');
module.exports = function() {
  var upload={};
  upload.uploadFile= function(filename) {  //base64 file string
    var deferred = Q.defer();
      cloudinary.uploader.upload(filename,function(result){
        fs.unlink(filename,function(err){
          if(err){
            console.log(err);
           return deferred.reject(err);
          }
          deferred.resolve(result);
        });
      },{ resource_type: "auto" })

    return deferred.promise;
  }
  upload.uploadBase64 = function(file) {  //base64 file string
    var myUUID = uuid();
    var data = new Buffer(file, 'base64');
    var deferred = Q.defer();
    fs.writeFile(myUUID,data, function(err) {
      if(err) {
        return deferred.reject(err);
      }
      cloudinary.uploader.upload(myUUID,function(result){
        fs.unlink(myUUID,function(err){
          if(err){
            return deferred.reject(err);
          }
          deferred.resolve(result);
        });
      },{ resource_type: "auto" })

    });
    return deferred.promise;
  }
  return upload;
}

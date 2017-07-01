module.exports = function (router) {
  router.post('/', function (req, res) {
    const exec = require('child_process').exec;
    res.send("Deployment Started")
    exec('sh deploy.sh', function(error, stdout, stderr) {
      if (error) {
        //res.json(error);
      } else {
        //res.json(stdout);
      }
    });
  });
};

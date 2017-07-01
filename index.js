'use strict';
var express = require('express');
var kraken = require('kraken-js');
var path = require('path');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');

var options, app;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
  onconfig: function (config, next) {
    /*
     * Add any additional config setup or overrides here. `config` is an initialized
     * `confit` (https://github.com/krakenjs/confit/) configuration object.
     */

    next(null, config);
  }
};

app = module.exports = express();

app.use(express.static(__dirname + '/public'));// set the static files location /public/img will be /img for users

app.use(express.static(__dirname + '/uploads'));// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/sample-app/dist'));

app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));



global.log = require('./app/lib/logger');
global.appRoot = path.resolve(__dirname);


app.use(kraken(options));

app.on('start', function () {
  global.kraken = app.kraken;
  global.log.info('Application ready to serve requests.');
  global.log.info('Environment: %s', app.kraken.get('env:env'));
});

var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    session = require('express-session'),
  //  config = require('./api/config/params'),
    validator = require('express-validator'),
  //  params = require('./api/config/params'),
    path = require('path'),
    fs = require('fs');
// Port to connect to
var port = process.env.PORT || 8080;

var server=app.listen(port, function () {
    console.log("Your server is running at "+port);
});

// get our request parameters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* Library */
app.use('/public', express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

/* run app from all route */
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/views/index.html')
});

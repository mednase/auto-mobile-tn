var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    config = require('./server/config/params');

// Port to connect to
var port = process.env.PORT || 8080;

var server=app.listen(port, function () {
    console.log("Your server is running at "+port);
});

app.use(function (req, res, next) {


    try {
        decodeURIComponent(req.path)
    }
    catch(e) {
        return res.redirect('/error');
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        return res.sendStatus(200);
    }

    next();
});

// Connect to database
mongoose.connect(config.database);

// get our request parameters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* Library */
app.use('/public', express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));


var auth = require('./server/routes/auth');
var admin = require('./server/routes/admin');
var client = require('./server/routes/client');

app.use('/',admin, auth,client);

app.get('/error', function (req, res) {
    return res.sendFile(__dirname + '/public/views/core/error.html')
});


/* run app from all route */
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/views/index.html')
});
/**
 * Created by medna on 06/11/2016.
 */
var express = require('express'),
    User = require('../models/userModel'),
    Car = require('../models/carModel'),
    config = require('../config/params'),
    jwt = require('jwt-simple'),
    passport = require('passport'),
    async = require('async'),
    mongoose = require('mongoose');

var router = express.Router();


module.exports = (function () {

    router.all('/api/admin/*', passport.authenticate('jwt', {session: false}), function (req, res, next) {
        var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            User.findOne({username: decoded.username}).exec(function (err, user) {
                if (err) throw err;
                if (!user) {
                    return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                } else {
                    if (user.role == "ROLE_ADMIN") {
                        req.user = user;
                        next();
                    }
                }
            });
        } else
            return res.status(403).send({success: false, msg: 'No token provided.'});

    });

    router.post('/api/admin/car/new', function (req, res) {
        var car = new Car(req.body);
        car.save();
        return res.sendStatus(200);
    });

    router.post('/api/admin/car/update', function (req, res) {
        Car.findOne({_id: req.body._id}).exec(function (err, car) {
            if (err) throw err;
            if (car != null) {
                }else
                    return res.sendStatus(404);
            });
    });

    router.post('/api/admin/car/delete', function (req, res) {
        Car.findOne({_id:req.body._id},function (err, car) {
            if (err)throw  err;
            if(car)
                car.remove(function (err) {
                    if(err) throw err;
                    return res.sendStatus(200);
                });
            else
                return res.sendStatus(500);
        });
    });

    router.get('/api/admin/dashboard', function (req, res) {
        User.find(function (err, users) {
            Car.find(function (err, cars) {
                return res.send({registred: users.length, postedArticle: cars.length});
            })
        });

    });

    return router;
})();


var getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};
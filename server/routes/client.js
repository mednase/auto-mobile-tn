/**
 * Created by medna on 26/01/2017.
 */
var express = require('express'),
    async = require('async'),
    Car = require('../models/carModel'),
    Marque = require('../models/marqueModel'),
    mongoose = require('mongoose'),
    config = require('../config/params');

var router = express.Router();

module.exports = (function () {
    router.get('/api/marques', function (req, res) {
        Marque.find().exec(function (err, result) {
            res.json(result);
        });
    });

    router.get('/api/related/:id', function (req, res) {
        async.waterfall([
            function (done) {
                Car.findOne({_id: req.params.id}).sort({date_publication:-1}).then(function (err, car) {
                    done(car,err);
                })
            }, function (car) {
                Car.find({marque: car.marque,_id :{'$ne':car._id } }).limit(4).exec(function (err, result) {
                    if (err) throw err;
                    if (result)
                        return res.json(result);
                });
            }],function (err) {
            console.log(err);
        });
    });

    router.get('/api/cars', function (req, res) {
        Car.find().sort({date_publication:-1}).exec(function (err, result) {
            res.json(result);
        });
    });

    router.get('/api/marque/:marque', function (req, res) {
        Car.find({marque: new RegExp('^'+req.params.marque+'$', "i")}).sort({date_publication:-1}).exec(function (err, result) {
            if (result != null)
                res.json(result);
            else
                res.sendStatus(404);
        });
    });

    router.get('/api/car/:id', function (req, res) {
        Car.findOne({_id: req.params.id}).exec(function (err, result) {
            if (result != null)
                res.json(result);
            else
                res.sendStatus(404);
        });
    });
    router.get('/api/cars/:pagination', function (req, res) {
        var pagination = parseInt(req.params.pagination) - 1;
        var countQuery = function (callback) {
            Car.count(function (err, count) {
                callback(err, count);
            });
        };

        var retrieveQuery = function (callback) {
            Car.find().sort({date_publication:-1}).skip(pagination * config.itemsPerPage).limit(config.itemsPerPage).exec(function (err, result) {
                callback(err, result);
            });
        };
        async.parallel([countQuery, retrieveQuery], function (err, results) {
            res.json({cars: results[1], total: results[0]});
        });
    });
    router.get('/api/car/:id', function (req, res) {

        if (mongoose.Types.ObjectId.isValid(req.params.car_id))
            Car.findOne({_id: req.params.car_id}).exec(function (err, car) {
                if (err)throw err;
                if (car)
                    res.send(car);
                else
                    res.sendStatus(404);
            });
        else
            res.sendStatus(404);
    });


    return router;
})();
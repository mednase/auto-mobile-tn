/**
 * Created by medna on 26/01/2017.
 */
var express = require('express'),
    async = require('async'),
    Car = require('../models/carModel'),
    mongoose = require('mongoose'),
    config = require('../config/params');

var router = express.Router();

module.exports = (function () {

    router.get('/api/cars/:pagination',function (req,res) {
        var pagination=parseInt(req.params.pagination)-1;
        var countQuery = function(callback){
            Car.count(function (err, count) {
                callback(err, count);
            });
        };
        var retrieveQuery = function(callback){
            Car.find().skip(pagination*config.itemsPerPage).limit(config.itemsPerPage).exec(function (err, result) {
                callback(err,result);
            });
        };
        async.parallel([countQuery, retrieveQuery], function(err, results){
            res.json({users:results[1],total:results[0]});
        });
    });
    router.get('/api/car/:id',function (req,res) {

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
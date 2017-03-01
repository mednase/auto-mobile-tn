/**
 * Created by medna on 26/01/2017.
 */
var express = require('express'),
    async = require('async'),
    Car = require('../models/carModel'),
    Marque = require('../models/marqueModel'),
    Contact = require('../models/contactModel'),
    mongoose = require('mongoose'),
    config = require('../config/params'),
    Parameters=require('../models/parametersModel');

var router = express.Router();

module.exports = (function () {

    router.get('/api/parameters',function (req,res) {
        Parameters.findOne().exec(function (err,params) {
            if(err)throw err;
            return res.send(params);
        });
    });
    router.get('/api/home',function (req,res) {
        var usedCarQuery = function(callback){
            Car.find({condition:"old"}).sort({date_publication:-1}).limit(10).exec(function (err,cars) {
                callback(err, cars);
            });
        };
        var newCarQuery = function(callback){
            Car.find({condition:"new"}).sort({date_publication:-1}).limit(10).exec(function (err,cars) {
                callback(err, cars);
            });
        };
        async.parallel([usedCarQuery, newCarQuery], function(err, results){
            return res.json({newCars:results[1],usedCars:results[0]});
        });

    });

    router.get('/api/search',function (req,res) {
        var marque=req.query.marque?req.query.marque:"";
        var model=req.query.model?req.query.model:"";
        var year=req.query.year?req.query.year:"";
        var transmission=req.query.transmission?req.query.transmission:"";
        var condition=req.query.condition?req.query.condition:"";
        var yearQuery;
        if(year.toString().length<2)
            yearQuery="function() { return true;}";
        else
            yearQuery="function() { return this.annee.toString().match(/"+year+"/) != null;}";

        Car.find({marque: new RegExp(marque, "i"),model:new RegExp(model, "i"),
            "$where":yearQuery,
            condition: new RegExp(condition, "i"),
            transmission: new RegExp(transmission, "i")}).sort({date_publication:-1}).exec(function (err,data) {
            if(err)throw err;
            var price=[];
            if(req.query.price)
                 price=JSON.parse("[" + req.query.price + "]");

            if(price.length==2)
                data=data.filter(function (car) {
                    return (car.prix>=price[0] && car.prix<=price[1]);
                });
            return res.send(data);
        });
    });

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
        });
    });

    router.get('/api/cars', function (req, res) {
        Car.find().sort({date_publication:-1}).exec(function (err, result) {
            res.json(result);
        });
    });

    router.get('/api/new-cars', function (req, res) {
        Car.find({condition:"new"}).sort({date_publication:-1}).exec(function (err, result) {
            res.json(result);
        });
    });

    router.get('/api/old-cars', function (req, res) {
        Car.find({condition:"old"}).sort({date_publication:-1}).exec(function (err, result) {
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

    router.post('/api/contact/new',function (req,res) {
        req.check('email', 'Email not valid ').isEmail();
        req.check('name', '').isLength({min: 1, max: 50});
        req.check('message', '').isLength({min: 10, max: 500});
        req.check('phone', '').isLength({ max: 15});
        req.check('governorate', '').isLength({ max: 20});
        var errors = req.validationErrors();
        if (errors)
            res.send({success: false});
        else{
            var contact = new Contact(req.body);
            contact.save(function () {
                return res.send({success: true})
            });
        }
    });

    return router;
})();
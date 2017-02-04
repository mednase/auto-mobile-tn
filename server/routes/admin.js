/**
 * Created by medna on 06/11/2016.
 */
var express = require('express'),
    User = require('../models/userModel'),
    Car = require('../models/carModel'),
    Marque = require('../models/marqueModel'),
    Contact = require('../models/contactModel'),
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
                    }else
                        return res.sendStatus(401);
                }
            });
        } else
            return res.status(403).send({success: false, msg: 'No token provided.'});

    });

    router.get('/api/admin/notification',function (req,res) {

        Contact.find({seen:false}).sort({date:-1}).exec(function (err,contacts) {
            if(err)throw err;
            return res.send(contacts);
        }) ;
    });

    router.get('/api/admin/contacts',function (req,res) {

        Contact.find().sort({date:-1}).exec(function (err,contacts) {
            if(err)throw err;
            return res.send(contacts);
        }) ;
    });

    router.post('/api/admin/marque/new', function (req, res) {
        Marque.findOne({nom: new RegExp('^'+req.body.nom_marque+'$', "i")}).exec(function (err,marque) {
            if(err)throw err;
            if(marque!=null)
                return res.send({success:false});
            else{
                marque = new Marque();
                marque.nom=req.body.nom_marque;
                marque.save();
                return res.send({success:true});
            }
        });
    });
    router.post('/api/admin/model/new', function (req, res) {
        Marque.findOne({_id:req.body.marque_id }).exec(function (err,marque) {
            if(err)throw err;
            if(marque!=null && (marque.models.indexOf(req.body.model_name)==-1)){
                marque.models.push(req.body.model_name);
                marque.save();
                return res.send({success:true});

            } else
                return res.send({success:false});

        });
    });

    router.post('/api/admin/car/new', function (req, res) {
        var car = new Car(req.body);
        car.save();
        return res.sendStatus(200);
    });

    router.post('/api/admin/car/update', function (req, res) {
        Car.findById(req.body._id, function (err, car) {
            if (err) return handleError(err);
            car.marque = req.body.marque;
            car.model = req.body.model;
            car.porte = req.body.porte;
            car.prix = req.body.prix;
            car.annee = req.body.annee;
            car.couleur = req.body.couleur;
            car.place = req.body.place;
            car.energie = req.body.energie;
            car.type_vitesse = req.body.type_vitesse;
            car.capacite_moteur = req.body.capacite_moteur;
            car.images = req.body.images;
            car.caracteristique = req.body.caracteristique;

            car.save(function (err, updatedCar) {
                if (err) return handleError(err);
                return res.sendStatus(200);
            });
        });
    });

    router.post('/api/admin/car/delete', function (req, res) {
        Car.findOne({_id:req.body.id},function (err, car) {
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
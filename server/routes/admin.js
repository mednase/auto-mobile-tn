/**
 * Created by medna on 06/11/2016.
 */
var express = require('express'),
    User = require('../models/userModel'),
    Car = require('../models/carModel'),
    Marque = require('../models/marqueModel'),
    Contact = require('../models/contactModel'),
    Parameters = require('../models/parametersModel'),
    config = require('../config/params'),
    jwt = require('jwt-simple'),
    passport = require('passport'),
    async = require('async'),
    mailer = require('../config/Mailer'),
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

    router.post('/api/admin/change-params',function (req,res) {
        if(req.body._id==undefined){
            var param=new Parameters(req.body);
            param.save(function (err,savedP) {
                if(err)throw err;
                return res.send(savedP);
            })
        }else
        Parameters.findById({_id:req.body._id}).exec(function (err,param) {
            if(err)throw err;
            param.facebookUrl=req.body.facebookUrl;
            param.email=req.body.email;
            param.twitterUrl=req.body.twitterUrl;
            param.youtubeUrl=req.body.youtubeUrl;
            param.instagramUrl=req.body.instagramUrl;
            param.save(function (error,updatedParams) {
                if(error)throw error;
                    return res.send(updatedParams)
            })
        });
    });

    router.get('/api/admin/notification',function (req,res) {

        Contact.find().sort({date:-1}).exec(function (err,contacts) {
            if(err)throw err;
            return res.send(contacts);
        }) ;
    });

    router.post('/api/admin/notification/seen',function (req,res) {
       Contact.update({seen:false}, { $set: { seen: true }}).exec(function () {
           res.sendStatus(200);
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

    router.post('/api/admin/marque/delete', function (req, res) {
        Marque.findOne({_id:req.body._id},function (err, marque) {
            if (err)throw  err;
            if(marque)
                marque.remove(function (err) {
                    if(err) throw err;
                    return res.sendStatus(200);
                });
            else
                return res.sendStatus(500);
        });
    });
    router.post('/api/admin/model/delete', function (req, res) {
        Marque.findOne({_id:req.body.marque_id }).exec(function (err,marque) {
            if(err)throw err;
            if(marque!=null && (marque.models.indexOf(req.body.model_name)>-1)){
                marque.models.splice(marque.models.indexOf(req.body.model_name),1);
                marque.save();
                return res.send({success:true});

            } else
                return res.send({success:false});

        });
    });

    router.post('/api/admin/contact/replay', function (req, res) {
        var name=req.body.name;
        var message=req.body.message;
        var title=req.body.title;
        var destination=req.body.email;
        mailer.sendEmail(name,message,destination,title, function (err,result) {
            if(err) throw err;
            return res.sendStatus(200);
        });

    });

    router.post('/api/admin/contact/delete', function (req, res) {
        Contact.findOne({_id:req.body.id},function (err, contact) {
            if (err)throw  err;
            if(contact)
                contact.remove(function (err) {
                    if(err) throw err;
                    return res.sendStatus(200);
                });
            else
                return res.sendStatus(500);
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
            car.titre=req.body.titre;
            car.titre_ar=req.body.titre_ar;
            car.description=req.body.description;
            car.description_ar=req.body.description_ar;
            car.marque = req.body.marque;
            car.model = req.body.model;
            car.porte = req.body.porte;
            car.prix = req.body.prix;
            car.annee = req.body.annee;
            car.couleur = req.body.couleur;
            car.place = req.body.place;
            car.energie = req.body.energie;
            car.transmission = req.body.transmission;
            car.cylindre = req.body.cylindre;
            car.images = req.body.images;
            car.security = req.body.security;
            car.fonctional = req.body.fonctional;

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

    router.get('/api/admin/car/count',function (req,res) {
        Car.count(function (err,number) {
            return res.send({number});
        })
    });

    router.get('/api/admin/dashboard', function (req, res) {
        User.find(function (err, users) {
            Car.find(function (err, cars) {
                return res.send({registred: users.length, postedArticle: cars.length});
            })
        });

    });


    router.post('/api/admin/reset-password', function (req, res) {
        if (req.body.newPassword == req.body.confirmPassword) {
            User.findOne({role:"ROLE_ADMIN"}).exec(function (err, user) {
                if(err)throw err;
                User.comparePassword(req.body.oldPassword,user,function (err,result) {
                    if(result){
                        user.password = req.body.newPassword;
                        user.save(function (err) {
                            return res.json({error: 0});
                        });
                    }else
                        return res.json({error: 1});
                })

            });

        } else
            return res.json({error:2});
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
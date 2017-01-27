// load up the user model
var params = require('./params'),
    User = require('../models/userModel');

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;



var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = params.secret;
//opts.issuer = "mednaceur.tuni_env.com";
//opts.audience = "tuni_env.com";
module.exports = function (passport) {

    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        User.findOne({id: jwt_payload.sub}, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;
var user_schema = new Schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    password: String,
    firstname: String,
    lastname: String,
    phone: String,
    avatar: String,
    role: {type: String, default: "user"},
    dateJoin: {type: Date, default: Date.now},
    lastLogin: {type: Date},
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

user_schema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(user.password, salt, function (err, hash) {
                user.password = hash;
                next(user);
            });
        });
    } else
        return next();

});

var User = mongoose.model("User", user_schema);
module.exports = User;


module.exports.getUserByUsername = function (username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
};

module.exports.getUserByEmail = function (email, callback) {
    var query = {email: email};
    User.findOne(query, callback);
};

User.comparePassword = function (password, user, callback) {
    bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};
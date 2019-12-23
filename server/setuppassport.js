let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy
let UserModel = require('../models/user')

module.exports = function(){
    passport.serializeUser(function(user, done){
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done){
        UserModel.findById(id, function(err, user){
            done(null, user)
        });
    })

    passport.use('local-login', new LocalStrategy({
        'usernameField': 'email',
        'passwordField': 'password',
        'passReqToCallback': true
    },function(req, email, password, done){
        UserModel.findOne({'email':email}, function(err, user){
            if(err){
                throw err;
            }
            if(!user){
                req.flash('loginError', 'Username or Password Incorrect');
                return done(null, err)
            }
            if(!user.checkPassword(req.body.password)){
                req.flash('loginError', 'Username or Password Incorrect');
                return done(null, false)
            }
            return done(null, user);
        })
    }));
}
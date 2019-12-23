let router = require('express').Router();
let index = require('../controllers/index');
let image = require('../controllers/image');
let login = require('../controllers/login');
let passport = require('passport');
let isLogged = require('./isLogged');


module.exports = function(app){
    router.get('/', login.index);//login page
    router.get('/logged', isLogged, index.index);//home page
    router.post('/upload', image.create);//upload
    router.get('/image/:image_id', isLogged, image.index);//get specific image
    router.post('/image/:image_id/like', image.like);//like
    router.delete('/image/:image_id', image.remove);//delete
    router.post('/image/:image_id/comment', image.comment);//comment
    router.post('/signup', login.signup)//create account
    router.post('/login', passport.authenticate('local-login', {
        'successRedirect': '/logged',
        'failureRedirect': '/',
        'failureFlash': true
    }))
    router.get('/logout', login.logout);
    app.use(router);
}


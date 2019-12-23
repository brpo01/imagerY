// this file will help with all the configurations we need.
let routes = require('./routes');
let morgan = require('morgan');
let exphbs = require('express-handlebars');
let express = require('express');
let path = require('path');
let multer = require('multer');
let favicon = require('serve-favicon');
let moment = require('moment');
let bodyParser = require('body-parser')
let expressValidator = require('express-validator')
let session = require('express-session')
let flash = require('express-flash')
let passport = require('passport')
let setuppassport = require('./setuppassport')

module.exports = function(app){
    app.use(favicon(path.join(__dirname, '../public/images/favicon.ico')));
    app.use(morgan('dev'));
    app.use('/public/', express.static(path.join(__dirname, '../public/')));
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json())
    app.use(expressValidator());
    app.use(multer({dest: './public/upload/temp'}).single('file')); //multer is the package that enables us to upload images
    app.use(session({
        secret: '*zk-&w/%^%^#+=yf3!}',
        resave: false,
        saveUninitialized:false
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    setuppassport();

    routes(app);

    app.use(function(req, res){
        res.send('Route not Found');
    });

    app.engine('handlebars', exphbs.create({
        'defaultLayout':'main',
        'LayoutsDir':  app.get('views') + '/layouts',
        'partialsDir': app.get('views') + '/partials',
        'helpers':{

            timeago:function(timestamp){
                return moment(timestamp).startOf('minute').fromNow();
            }, 
        }
        
    }).engine);

    app.set('view engine', 'handlebars');

    return app; //this takes the app as a parameter then returns the app.
}



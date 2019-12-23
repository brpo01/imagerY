let ImageModel = require('../models/image');
let sidebar = require('../helpers/sidebar');

module.exports = {
    index: function(req, res){

        let indexviewModel = {
            images:[],
            user: req.user,
        }
        ImageModel.find({},{},{sort:{timestamp:-1}},function(err, images){
            console.log(images);
            if(err){
                throw err;
            }

            indexviewModel.images = images;

            sidebar(indexviewModel, function(indexviewModel){
                res.render('index', indexviewModel);
            });            
        });
    }
}
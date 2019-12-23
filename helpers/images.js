let imageModel = require('../models/image')

module.exports = {
    popular: function(callback){
        imageModel.find({},{},{sort:{likes:-1}, limit:9}, function(err, images){
            if(err){
                throw err
            }
            callback(null, images);
        });
    }
}
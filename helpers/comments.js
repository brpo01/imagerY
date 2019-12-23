let commentModel = require('../models/comment')
let imageModel = require('../models/image')
let async = require('async')

module.exports = {
    latest: function(callback){
        commentModel.find({},{},{sort:{timestamp:-1}, limit:5}, function(err, comments){
            if(err){
                throw err;
            }

            let attachImage = function(comment, next){
                imageModel.findOne({_id:comment.image_id}, function(err, image){
                    comment.image = image;
                    next(err)
                })
            }
            async.each(comments, attachImage, function(err){
                if(err){
                    throw err
                }
                callback(null, comments);
            });
        });
    }
}
let async = require('async')
let Stats = require('./stats')
let Images = require('./images')
let Comment = require('./comments')

module.exports = function(viewModel, callback){
    async.parallel([
        function(next){//stats info
            Stats(next)
        },
        function(next){//popular images
            Images.popular(next)
        },
        function(next){//latest comments
            Comment.latest(next)
        }
    ], function(err, results){
        viewModel.sidebar = {
            stats:results[0],
            popular:results[1],
            latests:results[2],
        }
        callback(viewModel);
    });
}
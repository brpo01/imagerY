let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let CommentSchema = new Schema({
    image_id:{type:ObjectId}, //foriegn key relationship between image model and comment model
    name:{type:String},
    email:{type:String},
    comment:{type:String},
    gravatar:{type:String},
    timestamp:{type:Date, 'default':Date.now()},
});


CommentSchema.virtual('image').set(function(image){
    this.comment_image = image;
}).get(function(){
    return this.comment_image;
});

module.exports = mongoose.model('comment', CommentSchema)
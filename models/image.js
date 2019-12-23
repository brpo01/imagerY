let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
let path = require('path');

let ImageSchema = new Schema({
    filename:{type:String},
    title:{type:String},
    description:{type:String},
    views: {type:Number, 'default':0},
    likes: {type:Number, 'default':0},
    timestamp:{type:Date, 'default':Date.now()},
    user_id: {type:ObjectId}
});

//return the image without the extension name
ImageSchema.virtual('uniqueId').get(function(){
    return this.filename.replace(path.extname(this.filename), '');
});

module.exports = mongoose.model('image', ImageSchema)
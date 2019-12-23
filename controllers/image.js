let path = require('path');
let fs = require('fs')
let ImageModel = require('../models/image');
let CommentModel = require('../models/comment');
let md5 = require('md5');
let sidebar = require('../helpers/sidebar')

module.exports = {
    index: function(req, res){
        let imageViewModel = {
            image:{},
            user: req.user,
            // disabled: true,
        }
        ImageModel.findOne({'filename':{$regex:req.params.image_id}}, function(err, image){
            if(err){
                throw err
            }

            image.views += 1;//increment no. of views when an imaged is viewed 
            image.save();

            // if(image.user_id == req.user._id){
            //     imageViewModel.disabled = false;
            // }

            imageViewModel.image = image;
            CommentModel.find({image_id:image._id}, function(err, comments){
                if(err){
                    throw err;
                }
                imageViewModel.comments = comments;
                sidebar(imageViewModel, function(imageviewModel){
                    res.render('image', imageViewModel)
                });
            });
        });
    },
    create: function(req, res){
        function saveImage(){
            let possible = 'abcdefghijklmnopqrstuvwyz012345689';
            let imgUrl = '';

            for(i=0; i<6; i++){
                imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            ImageModel.find({filename:{$regex:imgUrl}}, function(err, image){//regex is used to match a pattern
                if(err){
                    throw err;
                }
                if(image.length > 0){
                    saveImage();//recursion
                }
                else{
                    let tempPath = req.file.path;//to get the specific file
                    let ext = path.extname(req.file.originalname).toLowerCase();//to get the specific extension
                    let targetPath = path.resolve('./public/upload/' + imgUrl + ext);//stores all the files permamently in this location.

                    if(ext == '.jpg' || ext == '.jpeg' || ext == '.png' || ext == '.gif'){
                        fs.rename(tempPath, targetPath, function(err){ //helps to move a file from one location to another
                            if(err){
                                throw err;
                            }
                            let newImg = new ImageModel({
                                filename:imgUrl + ext,
                                title :req.body.title,
                                description: req.body.description,
                                user_id : req.user._id
                            });

                            newImg.save(function(err){
                                if(err){
                                    throw err
                                }
                                res.redirect('/logged');
                            })
                        }); 
                    }else{
                        fs.unlink(tempPath, function(err){
                            if(err){
                                throw err;
                            }
                            res.status(500).json({error:'Invalid Image Format'});
                        }); // deletes a file
                    }
                }
            });

            console.log(imgUrl)
        }
        saveImage()
    },
    like: function(req, res){
        ImageModel.findOne({filename:{$regex:req.params.image_id}}, function(err, image){
            if(!err && image){
                image.likes += 1;
                image.save(function(err){
                    if(err){
                        res.json(err);
                    }
                    else{
                        res.json({likes: image.likes});
                    }
                });
            }
            else{
                res.redirect('/')
            }
        });
    },
    remove: function(req, res){
        ImageModel.findOne({filename:{$regex:req.params.image_id}}, function(err, image){
            if(!err && image){
                fs.unlink(path.resolve('./public/upload/' + image.filename), function(err){
                    if(err){
                        throw err;
                    }
                    CommentModel.remove({image_id:image._id}, function(err){
                        if(err){
                            throw err;
                        }
                    });
                    image.remove(function(err){
                        if(err){
                            res.json(false);
                        }
                        else{
                            res.json(true);
                        }
                    });
                });
                
            }
            else{
                res.redirect('/')
            }
        });
    },
    comment:function(req, res){
        ImageModel.findOne({filename:{$regex:req.params.image_id}}, function(err, image){
            if(err){
                throw err;
            }
            if(image){
                let newComment = new CommentModel();
                newComment.image_id = image._id;
                newComment.name = req.user.name;
                newComment.email = req.user.email;
                newComment.gravatar = md5(req.user.email);
                newComment.comment = req.body.comment;

                newComment.save(function(err, comment){
                    if(err){
                        throw err
                    }
                    res.redirect('/image/' + image.uniqueId + '#' + comment._id)
                });
            }
            else{
                res.redirect('/');
            }
        });
    }
}
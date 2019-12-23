let UserModel = require('../models/user')
module.exports = {
    index: function(req, res){
        let loginViewModel = {
            layout:'layout',
            loginError:req.flash('loginError')
        }
        res.render('login', loginViewModel);
    },

    signup: function(req, res){
        req.check('firstname', 'First Name cannot be empty').trim().notEmpty();
        req.check('firstname', 'Only Letters are allowed for firstname').isAlpha();
        req.check('lastname', 'Last Name cannot be empty').trim().notEmpty();
        req.check('lastname', 'Only Letters are allowed for lastname').isAlpha();
        req.check('email', 'Email cannot be empty').trim().notEmpty();
        req.check('email', 'Enter a valid email').isEmail();
        req.check('password', 'Password cannot be empty').notEmpty();
        req.check('password', 'Password should be at least 8 characters').isLength({min:8});
        req.check('password', 'Password does not match confirm password').equals(req.body.confirmpassword);
        req.check('confirmpassword', 'Confirm Password cannot be empty').trim().notEmpty()

        let errors = req.validationErrors();
        if(errors){
            res.json(errors);
        }else{

            UserModel.findOne({email:req.body.email}, function(err,user){
                if(err){
                    throw err;
                }
                if(user){
                    req.send('User Already Exists!')
                }else{
                    let newUser = new UserModel();
                    newUser.firstname = req.body.firstname;
                    newUser.lastname = req.body.lasttname;
                    newUser.email = req.body.email;
                    newUser.password = newUser.encryptPassword(req.body.password);

                    newUser.save(function(err){
                        if(err){
                            throw err
                        }
                        res.send('OK');
                    })
                }
            }); 
        }
    },

    logout:function(req, res){
        req.logout();
        res.redirect('/');
    }
}
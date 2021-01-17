const express = require('express'),
    app = express(),
    router = express.Router(),
    User = require('../../models/User'),
    {isEmpty} = require('..//../helpers/upload-helpers'),
    bcrypt = require('bcryptjs'),
    fs = require('fs');



router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
})    


router.get('/', (req, res)=>{
    User.findOne({_id: req.user})
    .then(profile=>{
        res.render('admin/profile', {profile: profile});
    })
    .catch(err=>console.log(err))
})


router.get('/edit', (req, res)=>{
    User.findOne({_id: req.user})
    .then(profile=>{
        res.render('admin/profile/edit', {profile: profile});
    })
    .catch(err=>console.log(err))
})



router.put('/update', (req, res)=>{
    User.findOne({_id: req.user})
    .then(user=>{

        let filename =  user.file;
        if(!isEmpty(req.files)){
            let file =  req.files.file
            filename = Date.now() + '-' + file.name;
            let uploadDir = './public/uploads/';
            file.mv(uploadDir + filename, err=>{
                if(err)console.log(err);
            })

            if(user.file !== 'default.png'){
                let delDir = './public/uploads/';
                fs.unlink(delDir + user.file, err=>{
                    if(err)console.log(err);
                })
            }
        }

       

        if(!req.body.password){
            user.fullname =  req.body.fullname;
            user.email =  req.body.email;
            user.phone =  req.body.phone;
            user.file =  filename;

            user.save()
            .then(response=>{
                req.flash('success_msg', 'Updated profile successfully :)');
                res.redirect('/admin/profile');
            })
            .catch(err=>console.log(err))
        }else{
            user.fullname =  req.body.fullname;
            user.email =  req.body.email;
            user.phone =  req.body.phone;
            user.file =  filename;

            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(req.body.password, salt, (err, hash)=>{
                    user.password = hash
                    user.save()
                    .then(response=>{
                        req.flash('success_msg', 'Updated profile successfully :)');
                        res.redirect('/admin/profile');
                    })
                    .catch(err=>console.log(err))
                })
            })
        }

    })
    .catch(err=>console.log(err))
})



router.get('/unactivate', (req, res)=>{
    User.findOne({_id: req.user})
    .then(user=>{
        user.status = 'inactive';
        user.save()
        .then(response=>{
            req.flash('success_msg', 'Profile unactivated successfully :)');
            res.redirect('/admin/profile');
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})



module.exports = router;
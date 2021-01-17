const express = require('express'),
    app = express(),
    router = express.Router(),
    faker = require('faker'),
    bcrypt = require('bcryptjs'),
    fs = require('fs'),
    User = require('../../models/User'),
    Todo = require('../../models/Todo'),
    {isEmpty} = require('../../helpers/upload-helpers');


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
})    


router.get('/', (req, res)=>{
    User.find()
    .then(users=>{
        res.render('admin/users', {users: users});
    })
    .catch(err=>console.log(err))
})


router.get('/create', (req, res)=>{
    res.render('admin/users/create');
})


router.get('/dummy', (req, res)=>{
    res.render('admin/users/dummy');
})


router.get('/edit/:id', (req, res)=>{
    User.findOne({_id: req.params.id})
    .then(user=>{
        res.render('admin/users/edit', {user: user});
    })
    .catch(err=>console.log(err))
})


router.get('/show/:id', (req, res)=>{
    User.findOne({_id: req.params.id})
    .then(user=>{
        res.render('admin/users/show', {user: user});
    })
    .catch(err=>console.log(err))
})



router.post('/create', (req, res)=>{
    User.findOne({email: req.body.email})
    .then(user=>{
        if(user){
            req.flash('error_msg', 'Email aleady exists ):');
        }else{

            let filename = '';
            if(!isEmpty(req.files)){
                let file = req.files.file;
                filename = Date.now() + '-' + file.name;
                let uploadDir = './public/uploads/';
                file.mv(uploadDir + filename, err=>{
                    if(err)console.log(err);
                })
            }

            const newUser = new User();
            newUser.fullname =  req.body.fullname;
            newUser.email =  req.body.email;
            newUser.phone =  req.body.phone;
            newUser.role =  req.body.role;
            newUser.status =  req.body.status;
            newUser.file = filename;

            bcrypt.genSalt(10, (err,salt)=>{
                bcrypt.hash(req.body.password, salt, (err, hash)=>{
                    newUser.password = hash
                    newUser.save()
                    .then(response=>{
                        req.flash('success_msg', 'User registered successfully :)');
                        res.redirect('/admin/users');
                    })
                    .catch(err=>console.log(err))
                })
            })

        }
    })
    .catch(err=>console.log(err))
})




router.post('/dummy', (req, res)=>{
    for(let i = 0; i < req.body.number; i++){

        const newUser = new User();
        newUser.fullname =  faker.name.firstName() + ' ' + faker.name.lastName();
        newUser.email =  faker.internet.email();
        newUser.phone =  '080-000-0000-000';
        newUser.role =  'Subscriber';
        newUser.status =  'active';
        newUser.file = 'default.png';

        bcrypt.genSalt(10, (err,salt)=>{
            bcrypt.hash('00000', salt, (err, hash)=>{
                newUser.password = hash
                newUser.save()
                .then(response=>{
                    req.flash('success_msg', `${req.body.number} dummy users has been generated :)`);
                    res.redirect('/admin/users');
                })
                .catch(err=>console.log(err))
            })
        })
    }
})



router.put('/update/:id', (req, res)=>{
    User.findOne({_id: req.params.id})
    .then(user=>{
        let filename = user.file
        if(!isEmpty(req.files)){
            let file = req.files.file;
            filename = Date.now() + '-' + file.name
            let uploadDir = './public/uploads/';
            file.mv(uploadDir + filename, err=>{
                if(err)console.log(err)
            })


            if(user.file !== 'default;png'){
                let delDir =  './public/uploads/';
                fs.unlink(delDir + user.file, err=>{
                    if(err)console.log(err)
                })
            }
        }
   
        if(!req.body.password){
            user.fullname =  req.body.fullname;
            user.email =  req.body.email;
            user.phone =  req.body.phone;
            user.status =  req.body.status;
            user.role =  req.body.role;
            user.file =  filename;

            user.save()
            .then(response=>{
                req.flash('success_msg', 'Updated user successfully :)');
                res.redirect('/admin/users');
            })
            .catch(err=>console.log(err))
        }else{
            user.fullname =  req.body.fullname;
            user.email =  req.body.email;
            user.phone =  req.body.phone;
            user.status =  req.body.status;
            user.role =  req.body.role;
            user.file =  filename;

            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(req.body.password, salt, (err, hash)=>{
                    user.password = hash
                    user.save()
                    .then(response=>{
                        req.flash('success_msg', 'Updated user successfully :)');
                        res.redirect('/admin/users');
                    })
                    .catch(err=>console.log(err))
                })
            })

        }

    })
    .catch(err=>console.log(err))
})



router.delete('/delete/:id', (req, res)=>{
    User.findOne({_id: req.params.id})
    .then(user=>{
        if(user.file !== 'default.png'){
            let delDir =  './public/uploads/';
            fs.unlink(delDir + user.file, err=>{
                if(err)console.log(err)
            })
        }

        Todo.find({user: req.params.id})
        .then(todos=>{
            todos.forEach(todo=>{
                if(todo.file !== 'img_place.png'){
                    let todo_delDir =  './public/uploads/';
                    fs.unlink(todo_delDir + todo.file, err=>{
                        if(err)console.log(err)
                    })
                }

                todo.delete()
                .then(response=>{

                    user.delete()
                    .then(response=>{
                        req.flash('success_msg', 'Deleted user successfully :)');
                        res.redirect('/admin/users');
                    })
                    
                })
            })
        })
        .catch(err=>console.log(err))

    })
})



router.post('/multiaction', (req, res)=>{
    User.find({_id: req.body.checkboxes})
    .then(users=>{
        users.forEach(user=>{
            if(req.body.action == 'active'){
                user.status = 'active';
                user.save()
                .then(response=>{
                    req.flash('success_msg', 'Operation performed successfully :)');
                    res.redirect('/admin/users');
                })
                .catch(err=>console.log(err))
            }else if(req.body.action == 'inactive'){
                user.status = 'inactive';
                user.save()
                .then(response=>{
                    req.flash('success_msg', 'Operation performed successfully :)');
                    res.redirect('/admin/users');
                })
                .catch(err=>console.log(err))
            }else if(req.body.action == 'delete'){
                if(user.file !== 'default.png'){
                    let delDir = './public/uploads/'
                    fs.unlink(delDir + user.file, err=>{
                        if(err)console.log(err);
                    })
                }

                user.delete()
                .then(response=>{
                    req.flash('success_msg', 'Operation performed successfully :)');
                    res.redirect('/admin/users');
                })
                .catch(err=>console.log(err))
            }
        })
    })
})



module.exports = router
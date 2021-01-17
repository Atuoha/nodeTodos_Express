const { Passport } = require('passport/lib');

const express = require('express'),
    app = express(),
    router = express.Router(),
    bcrypt = require('bcryptjs'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User =  require('../../models/User');

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'home';
    next();
})    

router.get('/', (req, res)=>{
    res.render('home');
})


router.get('/signin', (req, res)=>{
    if(req.user){
        res.redirect('/admin');
    }
    res.render('home/login');
})


router.get('/signup', (req, res)=>{
    if(req.user){
        res.redirect('/admin');
    }
    res.render('home/register');
})


router.get('/about', (req, res)=>{
    res.render('home/about');
})


router.post('/signup', (req, res)=>{

    User.findOne({email: req.body.email})
    .then(user=>{
        if(user){
            req.flash('error_msg', 'User exists with email!');
            res.redirect('back');
        }else{

            const newUser = new User();
            newUser.email =  req.body.email;
            newUser.fullname =  req.body.fullname;
            newUser.password =  req.body.password;


            if(req.body.email == 'tony@gmail.com'){
                newUser.role = 'Admin';
            }

            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(req.body.password, salt, (err, hash)=>{
                    if(err)console.log(err);
                    newUser.password = hash;
                    newUser.save()
                    .then(saved=>{
                        req.flash('success_msg', 'Account registered. Login now!');
                        res.redirect('/signin');
                    })
                    .catch(err=>console.log(err))
                })
            })

        }
    })
})



// login using passport
passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
    User.findOne({email: email})
    .then(user=>{
        if(!user){
            return done(null, false, {message: 'Email not recognised!'});
        }else{
            bcrypt.compare(password, user.password, (err, matched)=>{
                if(err)console.log(err);
                if(!matched){
                    return done(null, false, {message: 'Password mismatch. Try again!'});
                }else{
                    console.log(`logged in as ${user.email} -> ${user.role}`)
                    return done(null, user);
                }
            })
        }
    })
    .catch(err=>console.log(err))
}))


passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});


router.post('/signin', (req, res, next)=>{
    passport.authenticate('local', {
          successRedirect: '/admin',
          failureRedirect: '/signin',
          failureFlash: true
    })(req, res, next)
  
  })
  
  
  
  
  // logout
  router.get('/logout', (req, res)=>{
      req.logout();
      res.redirect('/')
  })
  

module.exports = router;
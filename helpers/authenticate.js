module.exports = {

    signinAuth: function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }

        res.redirect('/signin')
    }
}
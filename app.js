const express =  require('express'),
    app = express(),
    PORT = process.env.PORT || 4111,
    mongoose =  require('mongoose'),
    path = require('path'),
    upload = require('express-fileupload'),
    handlebars = require('express-handlebars'),
    Handlebars = require('handlebars'),
    {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access'),
    bodyParser = require('body-parser'),
    flash = require('connect-flash'),
    session = require('express-session'),
    passport = require('passport'),
    methodOverride = require('method-override'),
    { mongodbURL } = require('./config/config');
 
    
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);    

mongoose.connect(mongodbURL, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(db=>{
        console.log('Database connected');
    })
    .catch(err=>console.log(err));


app.use(express.static(path.join(__dirname, 'public')));


// custom select handlebars function
const {select, generate_date, ifeq, paginate} = require('./helpers/handlebars-helpers')

// 

// --SETTING view engine using handlebars
app.engine('handlebars', handlebars(
    {
        defaultLayout: 'home',
        helpers:{select: select, generate_date: generate_date, ifeq: ifeq, paginate: paginate},
        partialsDir: path.join(__dirname, "views/layouts/partials"),
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    
    }
    
))

app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.use(flash());
app.use(upload());
app.use(methodOverride('_method'))

// Session Middleware
app.use(session({
    secret: 'tonyAtuoha',
    resave: true,
    saveUninitialized: true
}));

//Passport inits
app.use(passport.initialize());
app.use(passport.session());


// sETTing local variable for flash msgs
app.use( (req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.loggedUser = req.user 
    next();
})



// ROUTES
// home
const home = require('./routes/home/index');
app.use('/', home);


// admin
const admin = require('./routes/admin/index');
app.use('/admin', admin);


// todos
const todos = require('./routes/admin/todo');
app.use('/admin/todos', todos);



app.listen(PORT, ()=>{
    console.log(`Listening to port ${PORT}`);
})    
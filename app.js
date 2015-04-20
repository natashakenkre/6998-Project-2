var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var csrf=require('csurf');
var mongoose = require('mongoose');
var utils = require('utils');
//var model = require('model');
//var models = require('../models');
//var utils = require('../utils');
var sessions = require('client-sessions');
var session = require('express-session')

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

//Connect to DB
mongoose.connect('mongodb://localhost/newauth');


var User = mongoose.model('User', new Schema({
  id: ObjectId,
  firstName: String,
  lastName: String,
  email:{ type: String, unique: true},
  password: String,
}));

var app = express();
app.set('view engine', 'jade');
app.locals.pretty = true;

//middleware
app.use(bodyParser.urlencoded({ extended: true}));

app.use(sessions({
  cookieName: 'session',
  secret: 'osrddsweoiu7rkwnv9802174rwdjvbjlwekr79',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(csrf());


app.use(function(req, res, next){
  if(req.session && req.session.user){
    User.findOne({email: req.session.user.email}, function(err, user){
      if(user){
        req.user=user;
        delete req.user.password;
        req.session.user=req.user;
        res.locals.user=req.user;
      }
      next();
    });
  }else{
    next();
  }
});

function requireLogin(req, res, next){
  if(!req.user){
    res.redirect('/login');
  }else{
    next();
  }
}

app.get('/', function(req , res){
  res.render('index.jade');
});

app.get('/register', function(req, res){
  res.render('register.jade',{csrfToken: req.csrfToken()});

});

app.post('/register', function(req, res){
  var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  
  var user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hash,
  });
  user.save(function(err) {
    if(err) {
      var err = 'Try again. An error occurred';
      if(err.code == 11000) {
        error = 'This email address is already taken! Try another one.'; 
      }
      res.render('register.jade', { error: error});
    } else {
      console.log("entering loop");
      req.session.user = user;
      res.redirect('/dashboard');
    }
  });
});
/*app.post('/register', function(req, res) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.password, salt);

  var user = new User({
    firstName:  req.body.firstName,
    lastName:   req.body.lastName,
    email:      req.body.email,
    password:   hash,
  });
  user.save(function(err) {
    if (err) {
      var error = 'Something bad happened! Please try again.';

      if (err.code === 11000) {
        error = 'That email is already taken, please try another.';
      }

      res.render('register.jade', { error: error });
    } else {
      utils.createUserSession(req, res, user);
      res.redirect('/dashboard');
    }
  });
});
*/




app.get('/login', function(req, res){
  res.render('login.jade',{csrfToken: req.csrfToken()});
});

app.post('/login', function(req, res){
  User.findOne({ email: req.body.email }, function(err,user) {
    if(!user) {
      res.render('login.jade', { error: 'invalid email or password.'});
    } else {
      if(bcrypt.compareSync(req.body.password, user.password)) {
        req.session.user = user;
        res.redirect('/dashboard');
      } else {
        res.render('login.jade', { error: 'Invalid email or password.'});
      }
    }
  });
});

/*app.post('/login', function(req, res) {
  User.findOne({ email: req.body.email }, 'firstName lastName email password data', function(err, user) {
    if (!user) {
      res.render('login.jade', { error: "Incorrect email / password." });
    } else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        utils.createUserSession(req, res, user);
        res.redirect('/dashboard');
      } else {
        res.render('login.jade', { error: "Incorrect email / password."  });
      }
    }
  });
});
*/



app.get('/dashboard', requireLogin, function(req,res){
  
    res.render('dashboard.jade');
});




/*app.get('/dashboard', function(req,res){
  res.render('dashboard.jade');
});
*/




app.get('/logout', function(req,res){
  req.session.reset();
  res.redirect('/');

});




app.listen(4000);

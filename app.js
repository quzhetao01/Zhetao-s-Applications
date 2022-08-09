require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy=require('passport-facebook').Strategy;
const findOrCreate = require("mongoose-findorcreate");

const applications = require("./routes/application")

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('static'));

// configuring session middleware
app.use(require('express-session')({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize()); // intialising passport
app.use(passport.session()); // configuring passport to make use of session

mongoose.connect("mongodb://localhost:27017/accountsDB");

const accountSchema = new mongoose.Schema({
    username: String,
    password: String
});

//passportLocalMongoose helps to store the password and hash it for us
accountSchema.plugin(passportLocalMongoose); 
accountSchema.plugin(findOrCreate);
const Account = mongoose.model('Account', accountSchema);

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/main"
  },
  function(accessToken, refreshToken, profile, cb) {
    Account.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

//Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    Account.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

// createStrategy helps to configure local strategy (Shortcut given by passport-local-mongoose)
passport.use(Account.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id); 
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    Account.findById(id, function(err, user) {
        done(err, user);
    });
});




app.get('/', function(req, res) {
    res.render('home');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/main', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/success');
  });

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/success');
  });

app.get('/success', function(req, res) {
    // console.log(req);
    res.set('Cache-Control', 'no-store');
    if (req.isAuthenticated()) {
        res.render('successLogin');
    }
    else {
        res.redirect('/');
    }
})

app.get('/login', function(req, res) {
    res.render('login');
});

app.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/success');
});

app.get('/register', function(req, res) {
    res.render('register');
});

app.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            console.log(err);
            return res.redirect('/register');
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/success');
        });
    });
});

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

app.use('/app', applications);


app.listen(5000, function(){
    console.log('Server has started on port 5000');
});
    
    // console.log(__dirname);
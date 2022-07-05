require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("session");

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('static'));

app.use(require('express-session')({
    secret: 'learningpassport',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', function(req, res) {
    res.render('home');
});

app.get('/login', function(req, res) {
    res.send('Hello');
});

app.get('register', function(req, res) {

});


app.listen(3000, function(){
    console.log('Server has started on port 3000');
});
    
    // console.log(__dirname);
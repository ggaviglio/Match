var express = require('express');
var router = express.Router();
const db = require('../db/index');
var bcrypt = require('bcrypt');
var passport = require('passport');

const saltRounds = 10; 

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

/* Login get*/
router.get('/login', function(req, res) {
  res.render('login', { title: 'Card Match' });
});

/* Register get*/
router.get('/register', function(req, res) {
  res.render('register', { title: 'Card Match' });
});

// /* Login post */
// router.post('/login', passport.authenticate() {


// });

/* Register post */
router.post('/register', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  //validation
  req.checkBody('username', 'Name is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password);

  var errors = req.validationErrors();
  var user_id = null;

  if(errors){
    console.log('FORM FAIL username: ' + username);
    res.render('register',{title:'Card Match', errors:errors});
  } else {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      db.one(`INSERT INTO users (username, password) VALUES ($1,$2) RETURNING id`,
        [username, hash]).then(data => {
          user_id = data.id;
          console.log('user_id: '+ user_id);
          req.login(user_id, function(err) {
            res.redirect('../');
          });
        });                 
    });  
  }
});

passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});

module.exports = router;
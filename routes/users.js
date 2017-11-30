var express = require('express');
var router = express.Router();
const db = require('../db/index');
var bcrypt = require('bcrypt');

const saltRounds = 10; 

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

/* Register */
router.get('/register', function(req, res) {
  res.render('register', { title: 'Card Match' });
});

/* Login */
router.get('/login', function(req, res) {
  res.render('login', { title: 'Card Match' });
});

/* Register */
router.post('/register', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  //validation
  req.checkBody('username', 'Name is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if(errors){
    console.log('FORM FAIL username: ' + username);
    res.render('register',{title:'Card Match', errors:errors})
  } else {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      db.any(`INSERT INTO users (username, password) VALUES ($1,$2)`,
        [username, hash]);
        res.render('register', { title: 'Reg complete' });  
    });  
  }
});

module.exports = router;
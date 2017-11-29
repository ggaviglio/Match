var express = require('express');
var router = express.Router();
const db = require('../db/index'); 

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

module.exports = router;
var express = require('express');
var router = express.Router();

/* GET home or profile page. */
router.get('/', function(req, res) {
	console.log(req.user);
	console.log(req.isAuthenticated())
	if (req.isAuthenticated() == true){
		res.render('profile', { title: 'Card Match - profile' });
	} else {
		res.render('index', { title: 'Card Match - index' });
	}
    
});

// /* GET profile page. */ //only runs routs if authentication passes
// router.get('/', authenticationMiddleware() ,function(req, res) {
// 	console.log(req.user);
// 	console.log(req.isAuthenticated())
//     res.render('profile', { title: 'Card Match' });
// });

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Card Match' });
});

function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('users/login')
	}
}

module.exports = router;
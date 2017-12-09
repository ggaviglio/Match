var express = require('express');
var router = express.Router();

/* GET profile page. */
router.get('/', function(req, res) {
	if (req.isAuthenticated() == false){
		res.redirect('../');
	} else {
		res.render('game', { title: 'Card Match - game' });
	}   
});

module.exports = function(io)	{

	io.on('connection', function(socket){
	  console.log('Socket connection established');
	});

	return router;
}



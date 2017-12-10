var express = require('express');
var router = express.Router();
var passport = require('passport');

var roomList = [];
var roomno = 1;
var cards = createRandomCards();

/* GET profile page. */
router.get('/', function(req, res) {
	console.log(req.user.username);
	if (req.isAuthenticated() == false){
		res.redirect('../');
	} else {
		res.render('game', { title: 'Card Match', username: req.user.username, test_username: 'test username' });
	}   
});

function createGame(io, socket)	{
	var yourTurn = true;
	if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) {
		cards = createRandomCards();
		roomno++;
	} else if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length == 1)  {
		yourTurn= false;
	}
	
	var roomName = "room-"+roomno;
	socket.join(roomName);
	roomList[socket.id] = roomName;

	

	//Send this event to everyone in the room.
	io.to(roomName).emit('gameCreate', {
		room : roomName,
		cards: cards,
		turn: yourTurn
	});

	console.log("You are in room no. " + roomno);

	socket.on('message', function(data) {  
			message = data.username + ': ' + data.message;      
        	io.to(data.room).emit('message',{
        		message: message
        	});
    	});
	socket.on('join', function(data) {  
			var message = data.username + ' joined ' + data.room;      
        	io.to(data.room).emit('message',{
        		message: message
        	});
        	message = 'Game started. ' + data.username + ' make a play.';
        	if(data.start == true){
        		io.to(data.room).emit('message',{
        			message: message
        		});
        		io.to(data.room).emit('takeTurn',{

        		});
        	}
    	});

	socket.on('switch', function(data) {
		io.to(data.room).emit('switchTurn',{})
	});

}

// Taken from stackoverflow to shuffle cards
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function createRandomCards()	{
	var randomCards = [];
	for(var i = 0; i < 8; i++)	{
		var randomNumber = Math.floor(Math.random() * 50);
		while(randomCards.indexOf(randomNumber) !== -1)	{
			randomNumber = Math.floor(Math.random() * 50);
		}
		randomCards.push(randomNumber);
		randomCards.push(randomNumber);
	}
	randomCards = shuffle(randomCards);
	return randomCards;
}

module.exports = function(io)	{

	io.on('connection', function(socket){		
		createGame(io, socket);
		
	});

	return router;
}
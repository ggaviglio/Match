var socket = io.connect('http://localhost:3002');

socket.on('connect', function() {
  console.log('Client connected');
});

socket.on('disconnect', function() {
  console.log('Client connected');
});

socket.on('message', function(data) {
	console.log("Got message: " + data.message);
	var messageBox = document.getElementById("messagesBox");
	var message = document.createElement("li");
	console.log(messageBox);
	console.log(message);
	message.appendChild(document.createTextNode(data.message));
	messageBox.appendChild(message);
});

socket.on('gameCreate', function(data) {
	
	socket.removeAllListeners("gameCreate");
	currentGame = new Game(data);
	joinStatus(currentGame.turn);
	createCards(currentGame.cards);

	
	
});

var joinStatus = function(turn_status){
	var gameStatus = document.getElementById("status");
	if(currentGame.turn == true){
		gameStatus.innerHTML = "Wait for player to join...";
		start = false;	
	} else {
		gameStatus.innerHTML = "Wait for your turn...";	
		start = true;
	}
	socket.emit('join', {
			room: currentGame.room,
			username: 'dumby_username',
			start: start
		})
}

var createCards = function(dealtCards)	{
	var cards = document.getElementsByClassName("card-contents");
	for(var i = 0; i < cards.length; i++)	{
		cards[i].innerHTML = dealtCards[i];
	}
}



var Game = function(socketData)	{
	this.room = socketData.room;
	this.cards = socketData.cards;
	this.score = 0;
	this.turn = socketData.turn;
}

window.onload = function()	{

	document.getElementById("messageButton").addEventListener("click", function()	{
		var input = document.getElementById("messageInput").value;
		if(input.length == 0 )	return;

		socket.emit('message', {
			room: currentGame.room,
			message: input
		})	
	});

}
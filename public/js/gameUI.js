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
	createCards(currentGame.cards);
});

var createCards = function(dealtCards)	{
	var cards = document.getElementsByClassName("card");
	for(var i = 0; i < cards.length; i++)	{
		cards[i].innerHTML = dealtCards[i];
	}
}

var Game = function(socketData)	{
	this.nickname = socketData.nickname;
	this.room = socketData.room;
	this.cards = socketData.cards
	this.score = 0;
}

window.onload = function()	{

	document.getElementById("messageButton").addEventListener("click", function()	{
		var input = document.getElementById("messageInput").value;
		if(input.length == 0 )	return;

		socket.emit('message', {
			nickname: currentGame.room,
			message: input
		})	
	});

}
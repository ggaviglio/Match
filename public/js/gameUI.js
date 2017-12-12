var socket = io.connect();
var cardsChosen = [];
var successfulCardMatches = [];

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
	handleTurn(socket);	
});

var handleTurn = function(socket) {
	socket.on('takeTurn', function(data) {
		if(currentGame.turn == true){
			//event listeners add
			gameStatus.innerHTML = "Your turn!";
			
			setTimeout(function(){
				//take turn
					//do stuff 
            	socket.emit('endTurn', {room: currentGame.room});
            }, 2000);
		} else {
			gameStatus.innerHTML = "Wait for your turn...";
		}
	});

	socket.on('switchTurn', function(data) {
		if(currentGame.turn == true){
			currentGame.turn = false;
			//event listeners destory
		} else {
			currentGame.turn = true;
			//event listeners add
		}
	})
}

var joinStatus = function(turn_status){
	gameStatus = document.getElementById("status");
	//event listeners destory
	if(currentGame.turn == true){
		gameStatus.innerHTML = "Wait for player to join...";
		start = false;	
	} else {
		gameStatus.innerHTML = "Wait for your turn...";	
		start = true;
	}
	socket.emit('join', {
			room: currentGame.room,
			username: currentGame.username,
			start: start
		})
}

var createCards = function(dealtCards)	{
	var cards = document.getElementsByClassName("card-contents");
	for(var i = 0; i < cards.length; i++)	{
		cards[i].innerHTML = dealtCards[i];
	}
}



var Game = function(socketData) {
    this.room = socketData.room;
    this.cards = socketData.cards;
    this.score = 0;
    this.turn = socketData.turn;
    this.username = socketData.username;
    this.revealedCards = 0;
    this.correctCards = 0;
}
var checkCards = function() {
    var classname = document.getElementsByClassName("card-contents");
    if(classname[cardsChosen[0]].innerHTML == classname[cardsChosen[1]].innerHTML)  {
        successfulCardMatches.push(classname[cardsChosen[0]].getAttribute("data-value"));
        successfulCardMatches.push(classname[cardsChosen[1]].getAttribute("data-value"));
        classname[cardsChosen[0]].removeEventListener('click', myFunction, false);
        classname[cardsChosen[1]].removeEventListener('click', myFunction, false);              
        console.log("Cards match");
    }
    console.log(classname[cardsChosen[0]].innerHTML);
    console.log(classname[cardsChosen[1]].innerHTML);
}
window.onload = function()  {
    document.getElementById("messageButton").addEventListener("click", function()   {
        var input = document.getElementById("messageInput").value;
        if(input.length == 0 )  return;
        socket.emit('message', {
            room: currentGame.room,
            message: input,
            username: username
        })  
    });
    var classname = document.getElementsByClassName("card-contents");
    myFunction = function() {
        var index = this.getAttribute("data-value");
        if(cardsChosen.indexOf(index) !== -1)   {
            console.log(index + " already in list");
        }
        else if(currentGame.revealedCards == 1) {
            console.log("Pused next card");
            cardsChosen.push(index);
            console.log("2 cards in array");
            checkCards();
            cardsChosen = [];
            currentGame.revealedCards = 0;
        }
        else    {
            console.log("Paused next card");
            cardsChosen.push(index);
            currentGame.revealedCards++;
        }
    };
    for (var i = 0; i < classname.length; i++) {
        classname[i].addEventListener('click', myFunction, false);
    }
}
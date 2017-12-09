var socket = io.connect('http://localhost:3002');

socket.on('connect', function() {
  console.log('Client connected');
});

socket.on('gameCreate', function(data) {
	console.log(data.nickname);
	console.log(data.room);
	console.log(data.cards);
	socket.removeAllListeners("gameCreate");
});



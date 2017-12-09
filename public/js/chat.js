var socket = io.connect('http://localhost:3002');
socket.on('connect', function() {
  console.log('Client connected');
});
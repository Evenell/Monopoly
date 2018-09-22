// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var server = http.Server(app);
var socketIO = require('socket.io');
var io = socketIO(server);
var Player = require('Player.js');
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
	console.log("someone has joined the game");
});

var players = {};
io.on('connection', function(socket) {
	socket.on('new player', function() {
		players[socket.id] = Player.generateNewPlayer('a', socket.id);
	});
	socket.on('movement', function(moveData) {
		var player = players[socket.id] || {};
		if (moveData.moving && (moveData.tgtX < player.x - 1 || 
				moveData.tgtX > player.x + 1 || 
				moveData.tgtY < player.y - 1 || 
				moveData.tgtY > player.y + 1)) {
			player.moveToLocation(moveData.tgtX, moveData.tgtY);
		}
	});
});

setInterval(function() {
	io.sockets.emit('state', players);
}, 1000 / 60);

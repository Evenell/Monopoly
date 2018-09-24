// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var server = http.Server(app);
var socketIO = require('socket.io');
var io = socketIO(server);


var Player = require('Player.js');
var Bullet = require('Bullet.js');

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
var bullets = [];
io.on('connection', function(socket) {
	socket.on('new player', function() {
		players[socket.id] = Player.generateNewPlayer('a', socket.id);
	});
	socket.on('movement', function(moveData) {
		var player = players[socket.id] || {};

		player.updateDirection(moveData.dirX, moveData.dirY);

		if (moveData.moving && (moveData.tgtX < player.x - 5 || 
		 	moveData.tgtX > player.x + 5 || 
		 	moveData.tgtY < player.y - 5 || 
			moveData.tgtY > player.y + 5)) {
		 	player.moveToLocation(moveData.tgtX, moveData.tgtY);
		}
		for (var num in bullets) {
			var bullet = bullets[num];
			bullet.update();
		}
	});

	socket.on('action', function(actionData) {
		var player = players[socket.id];
		if (actionData.q) {
			var deg = (6.0 / 360) * Math.PI * 2;
			player.unitVectX = player.dirX;
			player.unitVectY = player.dirY;
			bullets.push(Bullet.create(player.x + player.dirX * 12, 
								   	   player.y + player.dirY * 12, player.dirX * Math.cos(2 * deg) - player.dirY * Math.sin(2 * deg), player.dirY * Math.cos(2 * deg) + player.dirX * Math.sin(2 * deg), socket.id));
			bullets.push(Bullet.create(player.x + player.dirX * 12, 
								   	   player.y + player.dirY * 12, player.dirX * Math.cos(deg) - player.dirY * Math.sin(deg), player.dirY * Math.cos(deg) + player.dirX * Math.sin(deg), socket.id));
			bullets.push(Bullet.create(player.x + player.dirX * 12, 
								   	   player.y + player.dirY * 12, player.dirX, player.dirY, socket.id));
			bullets.push(Bullet.create(player.x + player.dirX * 12, 
								   	   player.y + player.dirY * 12, player.dirX * Math.cos(deg) + player.dirY * Math.sin(deg), player.dirY * Math.cos(deg) - player.dirX * Math.sin(deg), socket.id));
			bullets.push(Bullet.create(player.x + player.dirX * 12, 
								   	   player.y + player.dirY * 12, player.dirX * Math.cos(2 * deg) + player.dirY * Math.sin(2 * deg), player.dirY * Math.cos(2 * deg) - player.dirX * Math.sin(2 * deg), socket.id));
			socket.emit('q executed', false);
		}
	});
});

setInterval(function() {
	io.sockets.emit('tick');
}, 1000 / 60);
setInterval(function() {
	io.sockets.emit('playerState', players);
	io.sockets.emit('bulletState', bullets);
}, 1000 / 60);

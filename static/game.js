var socket = io();
var movement = {
	moving: false,
	startX: 0,
	startY: 0,
	tgtX:  -1,
	tgtY:  -1
}
var shoot = false;

document.addEventListener('mousedown', function(event) {
	movement.moving = true;
	movement.tgtX = event.clientX;
	movement.tgtY = event.clientY;
});



socket.emit('new player');
setInterval(function() {
	socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function(players, bullets) {
	context.clearRect(0, 0, 800, 600);
	context.fillStyle = 'green';
	for (var id in players) {
		var player = players[id];
		context.beginPath();
		context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
		context.fill();
	}
});
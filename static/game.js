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
	context.fillStyle = 'black';
	for (var id in players) {
		var player = players[id];
		context.beginPath();
		context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
		context.fill();
		context.moveTo(player.x, player.y);
		context.arc(player.x, player.y, 15, -1 * Math.PI / 12, 7 * Math.PI / 12)
		context.lineTo(player.x + 20 * player.unitVectX, player.y + 20 * player.unitVectY);
		context.closePath();
		context.stroke();

	}
});
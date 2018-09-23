var socket = io();
var movement = {
	moving: false,
	startX: 0,
	startY: 0,
	tgtX:  -1,
	tgtY:  -1,
}
var action = {
	q: false,
	w: false,
	e: false,
	r: false,
	d: false,
	f: false
}

document.addEventListener('mousedown', function(event) {
	movement.moving = true;
	movement.tgtX = event.clientX;
	movement.tgtY = event.clientY;
});
document.addEventListener('keydown', function(event) {
	switch (event.keyCode) {
		case 81: //Q
			action.q = true;
			break;
		case 87: //W
			action.w = true;
			break;
		case 69: //E
			action.e = true;
			break;
		case 82: //R
			action.r = true;
			break;
		case  68: //D
			action.d = true;
			break;
		case 70: //F
			action.f = true;
			break;
	}
});

socket.emit('new player');
setInterval(function() {
	socket.emit('movement', movement);
}, 1000 / 60);

setInterval(function() {
	socket.emit('action', action);
}, 1000 / 60);

socket.on('q executed', function() {
	action.q = false;
});
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('playerState', function(players) {
	context.clearRect(0, 0, 800, 600);
	context.fillStyle = 'black';
	for (var id in players) {
		var player = players[id];
		context.beginPath();
		context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
		context.fill();
		context.moveTo(player.x, player.y);
		var newAngle1Sin = player.unitVectY * Math.cos(Math.PI / 4) + player.unitVectX * Math.sin(Math.PI / 4);
		var newAngle1Cos = player.unitVectX * Math.cos(Math.PI / 4) - player.unitVectY * Math.sin(Math.PI / 4);
		var newAngle2Sin = player.unitVectY * Math.cos(Math.PI / 4) - player.unitVectX * Math.sin(Math.PI / 4);
		var newAngle2Cos = player.unitVectX * Math.cos(Math.PI / 4) + player.unitVectY * Math.sin(Math.PI / 4);
		
		context.moveTo(player.x + 20 * player.unitVectX, player.y + 20 * player.unitVectY);
		context.lineTo(player.x + 10 * newAngle1Cos, player.y + 10 * newAngle1Sin);
		context.moveTo(player.x + 20 * player.unitVectX, player.y + 20 * player.unitVectY);
		context.lineTo(player.x + 10 * newAngle2Cos, player.y + 10 * newAngle2Sin);
		context.stroke();
	}

	
});

socket.on('bulletState', function(bullets) {
	context.fillStyle = 'red';
	for (var num in bullets) {
		var bullet = bullets[num];
		if (bullet.shouldExist) {
			context.beginPath();
			context.arc(bullet.x, bullet.y, 5, 0, 2 * Math.PI);
			context.fill();
		}
	}
});
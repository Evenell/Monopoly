var socket = io();
var movement = {
	moving: false,
	up: false,
	left: false,
	right: false,
	down: false,
	dirX: 0,
	dirY: 0
}
var action = {
	q: false,
	w: false,
	e: false,
	r: false,
	d: false,
	f: false,
	attack: false
}

var lastUsed = {
	q: 100,
	w: 100,
	e: 100,
	r: 100,
	d: 100,
	f: 100
}
document.getElementById("canvas").addEventListener('mousemove', function(event) {
	movement.dirX = event.clientX;
	movement.dirY = event.clientY;
})
document.getElementById("canvas").addEventListener('mousedown', function(event) {
	if (event.which == 3) {
		movement.moving = true;
		movement.tgtX = event.clientX;
		movement.tgtY = event.clientY;
	} 
});
document.addEventListener('keydown', function(event) {
	switch (event.keyCode) {
		case 87: //W
			movement.up = true;
			break;
		case 65: //A
			movement.left = true;
			break;
		case 83: //S
			movement.down = true;
			break;
		case 68: //D
			movement.right = true;
			break;
		case 81: //Q
			if (lastUsed.q > 100) {
				action.q = true;
				lastUsed.q = 1;
				break;
			}
	}
});

document.addEventListener('keyup', function(event) {
	switch (event.keyCode) {
		case 87: //W
			movement.up = false;
			break;
		case 65: //A
			movement.left = false;
			break;
		case 83: //S
			movement.down = false;
			break;
		case 68: //D
			movement.right = false;
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

socket.on('tick', function() {
	lastUsed.q++;
})
socket.on('q executed', function() {
	action.q = false;
	movement.moving = false;
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
		var newAngle1Sin = player.dirY * Math.cos(Math.PI / 4) + player.dirX * Math.sin(Math.PI / 4);
		var newAngle1Cos = player.dirX * Math.cos(Math.PI / 4) - player.dirY * Math.sin(Math.PI / 4);
		var newAngle2Sin = player.dirY * Math.cos(Math.PI / 4) - player.dirX * Math.sin(Math.PI / 4);
		var newAngle2Cos = player.dirX * Math.cos(Math.PI / 4) + player.dirY * Math.sin(Math.PI / 4);
		
		context.moveTo(player.x + 20 * player.dirX, player.y + 20 * player.dirY);
		context.lineTo(player.x + 10 * newAngle1Cos, player.y + 10 * newAngle1Sin);
		context.moveTo(player.x + 20 * player.dirX, player.y + 20 * player.dirY);
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
// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var server = http.Server(app);
var socketIO = require('socket.io');
var io = socketIO(server);


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


var Player = require('Player.js');
var Bullet = require('Bullet.js');


var players = {};
var bullets = [];

io.on('connection', function(socket) {
    socket.on('new player', function() {
        players[socket.id] = Player.generateNewPlayer('a', socket.id);
    });
    socket.on('movement', function(moveData) {
        var player = players[socket.id];
        if (typeof player != 'undefined') {
            player.updateDirection(moveData.dirX, moveData.dirY);
            if (!player.dead) {
                if (moveData.left) {
                    if (player.x - 5 < 800 && player.x - 5 > 0) {
                        player.x -= 5;
                    }
                }
                if (moveData.right) {
                    if (player.x + 5 < 800 && player.x + 5 > 0) {
                        player.x += 5;
                    }
                }
                if (moveData.up) {
                    if (player.y - 5 < 600 && player.y - 5 > 0) {
                        player.y -= 5;
                    }
                }
                if (moveData.down) {
                    if (player.y + 5 < 600 && player.y + 5 > 0) {
                        player.y += 5;
                    }
                }
            }
            for (var num in bullets) {
                var bullet = bullets[num];
                if (bullet.shouldExist) {
                    player.checkHit(bullet);
                    bullet.update();
                }
            }
        }
    });

    socket.on('action', function(actionData) {
        var player = players[socket.id] || {};
        if (actionData.leftClick) {
            if (!player.dead) {
                bullets.push(Bullet.create(player.x + player.dirX * 15.0,
                    player.y + player.dirY * 15.0,
                    player.dirX, player.dirY, socket.id));
            }
            socket.emit('abilities executed', false);
        }

        if (actionData.rightClick) {
            if (!player.dead) {
                var deg = (6.0 / 360.0) * Math.PI * 2.0;
                bullets.push(Bullet.create(player.x + player.dirX * 15.0,
                    player.y + player.dirY * 15.0,
                    player.dirX * Math.cos(2 * deg) - player.dirY * Math.sin(2 * deg),
                    player.dirY * Math.cos(2 * deg) + player.dirX * Math.sin(2 * deg), socket.id));
                bullets.push(Bullet.create(player.x + player.dirX * 15.0,
                    player.y + player.dirY * 15.0,
                    player.dirX * Math.cos(deg) - player.dirY * Math.sin(deg),
                    player.dirY * Math.cos(deg) + player.dirX * Math.sin(deg), socket.id));
                bullets.push(Bullet.create(player.x + player.dirX * 15.0,
                    player.y + player.dirY * 15.0, player.dirX, player.dirY, socket.id));
                bullets.push(Bullet.create(player.x + player.dirX * 15.0,
                    player.y + player.dirY * 15.0,
                    player.dirX * Math.cos(deg) + player.dirY * Math.sin(deg),
                    player.dirY * Math.cos(deg) - player.dirX * Math.sin(deg), socket.id));
                bullets.push(Bullet.create(player.x + player.dirX * 15.0,
                    player.y + player.dirY * 15.0,
                    player.dirX * Math.cos(2 * deg) + player.dirY * Math.sin(2 * deg),
                    player.dirY * Math.cos(2 * deg) - player.dirX * Math.sin(2 * deg), socket.id));
            }
            socket.emit('abilities executed', false);

        }

    });
});

setInterval(function() {
    io.sockets.emit('tick');
    io.sockets.emit('playerState', players);
    io.sockets.emit('bulletState', bullets);
}, 1000 / 60);
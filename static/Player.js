function Player(startX, startY, orientation, name, id) {
	this.x = startX;
	this.y = startY;
	this.orientation = orientation;
	this.velocity = [0,0];
	this.name = name;
	this.id = id;
}

Player.generateNewPlayer = function(name, id) {
	return new Player(300,300,0, name, id);
}

Player.prototype.moveToLocation = function(targetX, targetY) {
	var theta = Math.atan((targetY - this.y) / (targetX - this.x));
	this.orientation = theta;
	if (targetX != this.x) {
		this.x += (targetX - this.x) / 60;
	}
	if (targetY != this.y) {
		this.y += (targetY - this.y) / 60;
	}
}

module.exports = Player;
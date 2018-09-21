function Board(numPlayers) {
	this.currentPlayer = 1;
	this.board = Board.initialize();
	this.players = [];
	this.propertyArr = [40];
	for( var i = 0; i < numPlayers; i++) {
		players[i] = new Player(i);
	}
}

function initialize() {
	var result = jQuery.csv.toArrays(properties.csv);
	//Initializes all the properties
	for (var i = 0; i < 40; i++) {
		var index = result[i].position - 1;
		this.propertyArr[index] = result[i];
	}
}

function nextTurn() {
	this.currentPlayer = (this.currenPlayer + 1) % 5;
}

function checkBankrupt() {
	for (var i = 0; i < playerArr.length; i++) {
		if (players[i].isBankrupt()) {
			players[i] = null;
		}
	}
}

function move(distance) {
	players[this.currentPlayer].move(distance);
}

var Character = function() {
	this.x = 0;
	this.y = 0;
	this.minX = 0;
	this.maxX = 0;
	this.minY = 0;
	this.maxY = 0;
	this.edgeOffsetLeft = 0;
	this.edgeOffsetRight = 0;
	this.edgeOffsetTop = 0;
	this.edgeOffsetBottom = 0;
	this.enemyStartX = 0;
	this.enemyMaxX = 0;
};

Character.prototype.left = function() {
	return this.x + this.edgeOffsetLeft;
};

Character.prototype.right = function() {
	return this.x + this.edgeOffsetRight;
};

Character.prototype.top = function() {
	return this.y + this.edgeOffsetTop;
};

Character.prototype.bottom = function() {
	return this.y + this.edgeOffsetBottom;
};

// Enemies our player must avoid
var Enemy = function(character, speed) {
	this.sprite = playerImages[character].sprite;
	this.edgeOffsetTop = playerImages[character].edgeOffsetTop;
	this.edgeOffsetBottom = playerImages[character].edgeOffsetBottom;
	this.edgeOffsetLeft = playerImages[character].edgeOffsetLeft;
	this.edgeOffsetRight = playerImages[character].edgeOffsetRight;
	this.enemyStartX = playerImages[character].enemyStartX;
	this.enemyMaxX = playerImages[character].enemyMaxX;
	this.speed = speed;
	console.log(this);
	this.getRandomStart();
	console.log(this);
};

Enemy.prototype = Object.create(Character.prototype);

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.

	if (this.x < this.enemyMaxX) {
		this.x += dt * this.speed;
	} else {
		this.getRandomStart();
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.getRandomStart = function() {
	// The lanes start at y coordinate 62 and have an 83px spacing.
//	this.y = (Math.floor((Math.random() * 3)) * 83) + 62;
	this.y = (Math.floor((Math.random() * 3)) * 83) + (this.edgeOffsetBottom - this.edgeOffsetTop - 3);
	this.x = this.enemyStartX;
};



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var playerImages = {
	'bug': {
		sprite: 'images/enemy-bug.png'
		, startX: 200
		, startY: 405
		, minX: 0
		, maxX: 400
		, minY: 0
		, maxY: 400
		, edgeOffsetTop: 27
		, edgeOffsetBottom: 92
		, edgeOffsetLeft: 1
		, edgeOffsetRight: 99
		, enemyStartX: -271
		, enemyMaxX: 600
	},
	'boy': {
		sprite: 'images/char-boy.png'
		, startX: 200
		, startY: 405
		, minX: 0
		, maxX: 400
		, minY: 0
		, maxY: 400
		, edgeOffsetTop: 13
		, edgeOffsetBottom: 88
		, edgeOffsetLeft: 16
		, edgeOffsetRight: 83
		, enemyStartX: -271
		, enemyMaxX: 600
	},
	'cat-girl': {
		sprite: 'images/char-cat-girl.png'
		, startX: 200
		, startY: 406
		, minX: 0
		, maxX: 400
		, minY: 0
		, maxY: 400
		, edgeOffsetTop: 11
		, edgeOffsetBottom: 88
		, edgeOffsetLeft: 16
		, edgeOffsetRight: 83
		, enemyStartX: -271
		, enemyMaxX: 600
	},
	'horn-girl': {
		sprite: 'images/char-horn-girl.png'
		, startX: 200
		, startY: 406
		, minX: 0
		, maxX: 400
		, minY: 0
		, maxY: 400
		, edgeOffsetTop: 11
		, edgeOffsetBottom: 88
		, edgeOffsetLeft: 6
		, edgeOffsetRight: 83
		, enemyStartX: -271
		, enemyMaxX: 600
	},
	'pink-girl': {
		sprite: 'images/char-pink-girl.png'
		, startX: 200
		, startY: 404
		, minX: 0
		, maxX: 400
		, minY: 0
		, maxY: 400
		, edgeOffsetTop: 12
		, edgeOffsetBottom: 88
		, edgeOffsetLeft: 12
		, edgeOffsetRight: 88
		, enemyStartX: -271
		, enemyMaxX: 600
	},
	'princess-girl': {
		sprite: 'images/char-princess-girl.png'
		, startX: 200
		, startY: 413
		, minX: 0
		, maxX: 400
		, minY: 0
		, maxY: 400
		, edgeOffsetTop: 2
		, edgeOffsetBottom: 88
		, edgeOffsetLeft: 13
		, edgeOffsetRight: 87
		, enemyStartX: -271
		, enemyMaxX: 600
	}
};

var Player = function(character) {
	this.sprite = playerImages[character].sprite;
	this.x = playerImages[character].startX;
	this.y = playerImages[character].startY;
	this.minX = playerImages[character].minX;
	this.maxX = playerImages[character].maxX;
	this.minY = playerImages[character].minY;
	this.maxY = playerImages[character].maxY;
	this.edgeOffsetTop = playerImages[character].edgeOffsetTop;
	this.edgeOffsetBottom = playerImages[character].edgeOffsetBottom;
	this.edgeOffsetLeft = playerImages[character].edgeOffsetLeft;
	this.edgeOffsetRight = playerImages[character].edgeOffsetRight;
};

Player.prototype = Object.create(Character.prototype);

Player.prototype.update = function() {
	var
		i
		collision = false;
	for (i = 0; i < allEnemies.length; i++) {

	}

};

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
	switch(key) {
		case 'up':
			if (this.y > this.minY) {
				this.y -= 83;
			}
			break;
		case 'down':
			if (this.y < this.maxY) {
				this.y += 83;
			}
			break;
		case 'left':
			if (this.x > this.minX) {
				this.x -= 101;
			}
			break;
		case 'right':
			if (this.x < this.maxX) {
				this.x += 101;
			}
			break;
	}
	console.log(this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [
	new Enemy('boy', 300)
	, new Enemy('bug', 400)
	, new Enemy('bug', 500)
];

var player = new Player('pink-girl');

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});

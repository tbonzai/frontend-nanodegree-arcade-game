var Character = function() {
	this.x = 0;
	this.y = 0;
	this.startX = 0;
	this.startY = 0;
	this.minX = 0;
	this.maxX = 0;
	this.minY = 0;
	this.maxY = 0;
	this.edgeOffsetLeft = 0;
	this.edgeOffsetRight = 0;
	this.edgeOffsetTop = 0;
	this.edgeOffsetBottom = 0;
	this.offScreenLeft = 0;
	this.offScreenRight = 0;
};

Character.prototype.leftEdge = function() {
	return this.x + this.edgeOffsetLeft;
};

Character.prototype.rightEdge = function() {
	return this.x + this.edgeOffsetRight;
};

Character.prototype.topEdge = function() {
	return this.y + this.edgeOffsetTop;
};

Character.prototype.bottomEdge = function() {
	return this.y + this.edgeOffsetBottom;
};

// Enemies our player must avoid
var Enemy = function(character, speed) {
	this.sprite = playerImages[character].sprite;
	this.edgeOffsetTop = playerImages[character].edgeOffsetTop;
	this.edgeOffsetBottom = playerImages[character].edgeOffsetBottom;
	this.edgeOffsetLeft = playerImages[character].edgeOffsetLeft;
	this.edgeOffsetRight = playerImages[character].edgeOffsetRight;
	this.offScreenLeft = playerImages[character].offScreenLeft;
	this.offScreenRight = playerImages[character].offScreenRight;
	this.speed = speed;
	this.currentSpeed = speed;
	this.flyOffSpeed = 0;
	this.getRandomStart();
};

Enemy.prototype = Object.create(Character.prototype);

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	// Check the x coordinate to see if they are on the screen.
	if (this.x < this.offScreenRight) {
		this.x += dt * this.currentSpeed;
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
	this.y = (Math.floor((Math.random() * 3)) * 83) + (this.edgeOffsetBottom - this.edgeOffsetTop - 3);
	this.x = this.offScreenLeft;
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
		, offScreenLeft: -271
		, offScreenRight: 600
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
		, offScreenLeft: -271
		, offScreenRight: 600
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
		, offScreenLeft: -271
		, offScreenRight: 600
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
		, offScreenLeft: -271
		, offScreenRight: 600
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
		, offScreenLeft: -271
		, offScreenRight: 600
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
		, offScreenLeft: -271
		, offScreenRight: 600
	}
};

var Player = function(character) {
	this.sprite = playerImages[character].sprite;
	this.startX = playerImages[character].startX;
	this.startY = playerImages[character].startY;
	this.minX = playerImages[character].minX;
	this.maxX = playerImages[character].maxX;
	this.minY = playerImages[character].minY;
	this.maxY = playerImages[character].maxY;
	this.edgeOffsetTop = playerImages[character].edgeOffsetTop;
	this.edgeOffsetBottom = playerImages[character].edgeOffsetBottom;
	this.edgeOffsetLeft = playerImages[character].edgeOffsetLeft;
	this.edgeOffsetRight = playerImages[character].edgeOffsetRight;
	this.offScreenLeft = playerImages[character].offScreenLeft;
	this.offScreenRight = playerImages[character].offScreenRight;
	this.flyOffSpeed = 0;
	this.resetStart();
};

Player.prototype = Object.create(Character.prototype);

Player.prototype.flyOffScreen = function(dt, speed) {
	while (this.x < this.offScreenRight) {
		this.x += dt * speed;
	}
};

Player.prototype.resetStart = function() {
	this.x = this.startX;
	this.y = this.startY;
};

Player.prototype.update = function(dt) {
	var i;

	if (this.flyOffSpeed > 0) {
		if (this.x < this.offScreenRight) {
			// Make hte player fly off screen to the upper right.
			this.x += dt * this.flyOffSpeed;
			this.y --;
		} else {
			this.flyOffSpeed = 0;
			// Reset all enemies.
			for (i = 0; i < allEnemies.length; i++) {
				allEnemies[i].currentSpeed = allEnemies[i].speed;
				allEnemies[i].getRandomStart();
			}
			this.resetStart();
		}
	} else {
		// Iterate over the enemies and check for an image overlap on the player.
		for (i = 0; i < allEnemies.length; i++) {
			if (this.leftEdge() < allEnemies[i].rightEdge()
			    && this.rightEdge() > allEnemies[i].leftEdge()
			    && this.topEdge() < allEnemies[i].bottomEdge()
			    && this.bottomEdge() > allEnemies[i].topEdge()) {
				// We have a collision. Transfer the motion from the enemy to the player.
				this.flyOffSpeed = allEnemies[i].currentSpeed;
				allEnemies[i].currentSpeed = 0;
			}
		}
	}

};



Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
	switch(key) {
		case 'up':
			if (this.y > this.minY && this.flyOffSpeed === 0) {
				this.y -= 83;
			}
			break;
		case 'down':
			if (this.y < this.maxY && this.flyOffSpeed === 0) {
				this.y += 83;
			}
			break;
		case 'left':
			if (this.x > this.minX && this.flyOffSpeed === 0) {
				this.x -= 101;
			}
			break;
		case 'right':
			if (this.x < this.maxX && this.flyOffSpeed === 0) {
				this.x += 101;
			}
			break;
	}
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

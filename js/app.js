/**
  * This object contains details about the images in the game. It allows images
  * with varying attributes to be swapped out for one another.
*/
var appImages = {
	'bug': {
		sprite: 'images/enemy-bug.png'
		, startX: 200
		, startY: 405
		, minX: 0
		, maxX: 400
		, minY: 0
		, maxY: 400
		, characterOffsetTop: 27
		, characterOffsetBottom: 92
		, characterOffsetLeft: 1
		, characterOffsetRight: 99
		, offScreenLeft: -271
		, offScreenRight: 600
		, imageHeight: 171
		, imageWidth: 101
	},
	'boy': {
		sprite: 'images/char-boy.png'
		, startX: 200
		, startY: 405
		, minX: 0
		, maxX: 400
		, minY: 0
		, maxY: 400
		, characterOffsetTop: 13
		, characterOffsetBottom: 88
		, characterOffsetLeft: 16
		, characterOffsetRight: 83
		, offScreenLeft: -271
		, offScreenRight: 600
		, imageHeight: 171
		, imageWidth: 101
	},
	'cat-girl': {
		sprite: 'images/char-cat-girl.png'
		, startX: 200
		, startY: 406
		, minX: 0
		, maxX: 400
		, minY: 0
		, maxY: 400
		, characterOffsetTop: 11
		, characterOffsetBottom: 88
		, characterOffsetLeft: 16
		, characterOffsetRight: 83
		, offScreenLeft: -271
		, offScreenRight: 600
		, imageHeight: 171
		, imageWidth: 101
	},
	'horn-girl': {
		sprite: 'images/char-horn-girl.png'
		, startX: 200
		, startY: 406
		, minX: 0
		, maxX: 400
		, minY: 0
		, maxY: 400
		, characterOffsetTop: 11
		, characterOffsetBottom: 88
		, characterOffsetLeft: 6
		, characterOffsetRight: 83
		, offScreenLeft: -271
		, offScreenRight: 600
		, imageHeight: 171
		, imageWidth: 101
	},
	'pink-girl': {
		sprite: 'images/char-pink-girl.png'
		, startX: 200
		, startY: 404
		, minX: 0
		, maxX: 400
		, minY: 0
		, maxY: 400
		, characterOffsetTop: 12
		, characterOffsetBottom: 88
		, characterOffsetLeft: 12
		, characterOffsetRight: 88
		, offScreenLeft: -271
		, offScreenRight: 600
		, imageHeight: 171
		, imageWidth: 101
	},
	'princess-girl': {
		sprite: 'images/char-princess-girl.png'
		, startX: 200
		, startY: 413
		, minX: 0
		, maxX: 400
		, minY: 0
		, maxY: 400
		, characterOffsetTop: 2
		, characterOffsetBottom: 88
		, characterOffsetLeft: 13
		, characterOffsetRight: 87
		, offScreenLeft: -271
		, offScreenRight: 600
		, imageHeight: 171
		, imageWidth: 101
	}
};

/**
  * This is a super class from which all game characters will inherit methods and properties.
*/
var Character = function() {
	this.x = 0;
	this.y = 0;
	this.startX = 0;
	this.startY = 0;
	this.minX = 0;
	this.maxX = 0;
	this.minY = 0;
	this.maxY = 0;
	this.characterOffsetLeft = 0;
	this.characterOffsetRight = 0;
	this.characterOffsetTop = 0;
	this.characterOffsetBottom = 0;
	this.offScreenLeft = 0;
	this.offScreenRight = 0;
	this.imageHeight = 0;
	this.imageWidth = 0;
};

Character.prototype.getCharacterLeftEdge = function() {
	return this.x + this.characterOffsetLeft;
};

Character.prototype.getCharacterRightEdge = function() {
	return this.x + this.characterOffsetRight;
};

Character.prototype.getCharacterTopEdge = function() {
	return this.y + this.characterOffsetTop;
};

Character.prototype.getCharacterBottomEdge = function() {
	return this.y + this.characterOffsetBottom;
};

// Enemies our player must avoid
var Enemy = function(character, speed) {
	this.sprite = appImages[character].sprite;
	this.characterOffsetTop = appImages[character].characterOffsetTop;
	this.characterOffsetBottom = appImages[character].characterOffsetBottom;
	this.characterOffsetLeft = appImages[character].characterOffsetLeft;
	this.characterOffsetRight = appImages[character].characterOffsetRight;
	this.offScreenLeft = appImages[character].offScreenLeft;
	this.offScreenRight = appImages[character].offScreenRight;
	this.speed = speed;
	this.stopped = false;
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
	if (!this.stopped) {
		if (this.x < this.offScreenRight) {
			this.x += dt * this.speed;
		} else {
			this.getRandomStart();
		}
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.getRandomStart = function() {
	// The lanes start at y coordinate 62 and have an 83px spacing.
	this.y = (Math.floor((Math.random() * 3)) * 83) + (this.characterOffsetBottom - this.characterOffsetTop - 3);
	this.x = this.offScreenLeft;
};



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(character) {
	this.sprite = appImages[character].sprite;
	this.startX = appImages[character].startX;
	this.startY = appImages[character].startY;
	this.minX = appImages[character].minX;
	this.maxX = appImages[character].maxX;
	this.minY = appImages[character].minY;
	this.maxY = appImages[character].maxY;
	this.characterOffsetTop = appImages[character].characterOffsetTop;
	this.characterOffsetBottom = appImages[character].characterOffsetBottom;
	this.characterOffsetLeft = appImages[character].characterOffsetLeft;
	this.characterOffsetRight = appImages[character].characterOffsetRight;
	this.offScreenLeft = appImages[character].offScreenLeft;
	this.offScreenRight = appImages[character].offScreenRight;
	this.imageHeight = appImages[character].imageHeight;
	this.imageWidth = appImages[character].imageWidth;
	this.flyOffSpeed = 0;
	this.drawAngle = 0;
	this.resetStart();
};

Player.prototype = Object.create(Character.prototype);

Player.prototype.resetStart = function() {
	this.x = this.startX;
	this.y = this.startY;
};

Player.prototype.update = function(dt) {
	var i;

	if (this.flyOffSpeed > 0) {
		if (this.x < this.offScreenRight) {
			// Make the player fly off screen to the right.
			this.x += dt * this.flyOffSpeed;
			this.drawAngle += 10;
		} else {
			this.flyOffSpeed = 0;
			this.drawAngle = 0;
			// Reset all enemies.
			for (i = 0; i < allEnemies.length; i++) {
				allEnemies[i].stopped = false;
				allEnemies[i].getRandomStart();
			}
			this.resetStart();
		}
	} else {
		// Iterate over the enemies and check for an image overlap on the player.
		for (i = 0; i < allEnemies.length; i++) {
			if (this.getCharacterLeftEdge() < allEnemies[i].getCharacterRightEdge()
			    && this.getCharacterRightEdge() > allEnemies[i].getCharacterLeftEdge()
			    && this.getCharacterTopEdge() < allEnemies[i].getCharacterBottomEdge()
			    && this.getCharacterBottomEdge() > allEnemies[i].getCharacterTopEdge()) {
				// We have a collision. Transfer the motion from the enemy to the player.
				this.flyOffSpeed = allEnemies[i].speed;
				allEnemies[i].stopped = true;
			}
		}
	}

};

Player.prototype.render = function() {
	if (this.drawAngle != 0) {
		var
			imgCenter = this.x + (this.imageWidth / 2)
			, imgMiddle = this.y + (this.imageHeight / 2);
		ctx.translate(imgCenter, imgMiddle);
		ctx.rotate(this.drawAngle * Math.PI / 180);
		ctx.drawImage(
		    Resources.get(this.sprite)
		    , -1 * this.imageWidth / 2
		    , -1 * this.imageHeight / 2
		    , this.imageWidth
		    , this.imageHeight
		);
		ctx.rotate(-1 * this.drawAngle * Math.PI / 180);
		ctx.translate(-1 * imgCenter, -1 * imgMiddle);
	} else {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
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
	new Enemy('bug', 300)
	, new Enemy('bug', 400)
	, new Enemy('bug', 500)
];

var player = new Player('boy');

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

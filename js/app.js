/**
  * This object contains details about the images in the game. It allows images
  * with varying attributes to be swapped out for one another.
*/
var appCharacters = {
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
		, characterOffsetRight: 88
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
		, characterOffsetLeft: 16
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
		, characterOffsetLeft: 16
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
		, characterOffsetLeft: 16
		, characterOffsetRight: 87
		, offScreenLeft: -271
		, offScreenRight: 600
		, imageHeight: 171
		, imageWidth: 101
	}
};

var StartScreen = function() {
	this.characterArray = [];
	this.characterCurrent = 0;
	this.characterSpacingRadians = 0;
	this.queueRadians = 0;
	this.characterSpacingRadians = 0;
	this.show = true;

};

StartScreen.prototype.render = function(dt) {
	var
		i
		, radians
		, currX
		, currY
		, char
		, radianIncrement;

	// The first time we execute this code, set some object instance variables.
	if (this.characterArray.length === 0) {
		// Count the characters.
		var characterCount = 0;
		for (i in appCharacters) {
			characterCount++;
		}
		// Calculate the character spacing in radians.
		this.characterSpacingRadians = Math.PI * 2 / characterCount;
		// Set the initial character's radians to 270 degrees (straight up) from the 0 axis.
		radians = Math.PI * 1.5;
		// Iterate over the characters.
		for (i in appCharacters) {
			// Grab the character.
			char = appCharacters[i];
			// Calculate the x,y coordinates based on the radians
			currX = 250 + (150 * Math.cos(radians));
			currY = 250 + (150 * Math.sin(radians));
			// Add the character data to our array.
			this.characterArray.push({
				name: i
				, sprite: char.sprite
				, radians: radians
				, characterOffsetRight: char.characterOffsetRight
				, characterOffsetLeft: char.characterOffsetLeft
				, characterOffsetBottom: char.characterOffsetBottom
				, characterOffsetTop: char.characterOffsetTop
			});
			// Determine the next character's radians.
			radians += this.characterSpacingRadians;
		}
	}

	// Determine if there are any radians in the queue
	if (this.queueRadians > this.characterSpacingRadians * dt * 2) {
		radianIncrement = this.characterSpacingRadians * dt * 2;
		this.queueRadians -= this.characterSpacingRadians * dt * 2;
	} else if (this.queueRadians > 0) {
		radianIncrement = this.queueRadians;
		this.queueRadians = 0;
	} else if (this.queueRadians < (this.characterSpacingRadians * dt * -2)) {
		radianIncrement = this.characterSpacingRadians * dt * -2;
		this.queueRadians += this.characterSpacingRadians * dt * 2;
	} else if (this.queueRadians < 0) {
		radianIncrement = this.queueRadians;
		this.queueRadians = 0;
	} else {
		radianIncrement = 0;
	}

	// Clear the canvas.
	ctx.clearRect(0, 0, 505, 606);

	// Draw the selector image.
	ctx.drawImage(
		Resources.get('images/Selector.png')
		, 215
		, 35
	);

	// Draw the characters to the screen.
	for (i = 0; i < this.characterArray.length; i++) {
		// Perform any radian increment on the character object.
		this.characterArray[i].radians += radianIncrement;
		// Grab the character
	    char = this.characterArray[i];
	    // Draw the character to the screen.
		ctx.drawImage(
			Resources.get(char.sprite)
			, 250 + (150 * Math.cos(char.radians)) - ((char.characterOffsetRight - char.characterOffsetLeft) / 2)
			, 250 + (150 * Math.sin(char.radians)) - ((char.characterOffsetBottom - char.characterOffsetTop) / 2)
		);
	}
}

StartScreen.prototype.handleInput = function(key) {
	switch(key) {
		case 'enter':
			if (this.queueRadians === 0) {
				player.setPlayer(this.characterArray[this.characterCurrent].name);
				this.show = false;
			}
			break;
		case 'right':
			if (this.characterCurrent > 0) {
				this.characterCurrent--;
			} else {
				this.characterCurrent = this.characterArray.length - 1;
			}
			this.queueRadians += this.characterSpacingRadians;
			break;
		case 'left':
			if (this.characterCurrent < this.characterArray.length - 1) {
				this.characterCurrent++;
			} else {
				this.characterCurrent = 0;
			}
			this.queueRadians -= this.characterSpacingRadians;
			break;
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
	this.sprite = 'images/enemy-bug.png';
	this.characterOffsetTop = 27;
	this.characterOffsetBottom = 92;
	this.characterOffsetLeft = 1;
	this.characterOffsetRight = 99;
	this.offScreenLeft = -271;
	this.offScreenRight = 600;
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

var Player = function() {
	this.flyOffSpeed = 0;
	this.drawradians = 0;
};

Player.prototype = Object.create(Character.prototype);

Player.prototype.setPlayer = function(character){
	this.sprite = appCharacters[character].sprite;
	this.startX = appCharacters[character].startX;
	this.startY = appCharacters[character].startY;
	this.minX = appCharacters[character].minX;
	this.maxX = appCharacters[character].maxX;
	this.minY = appCharacters[character].minY;
	this.maxY = appCharacters[character].maxY;
	this.characterOffsetTop = appCharacters[character].characterOffsetTop;
	this.characterOffsetBottom = appCharacters[character].characterOffsetBottom;
	this.characterOffsetLeft = appCharacters[character].characterOffsetLeft;
	this.characterOffsetRight = appCharacters[character].characterOffsetRight;
	this.offScreenLeft = appCharacters[character].offScreenLeft;
	this.offScreenRight = appCharacters[character].offScreenRight;
	this.imageHeight = appCharacters[character].imageHeight;
	this.imageWidth = appCharacters[character].imageWidth;
	this.resetStart();
}

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
			this.drawradians += 10;
		} else {
			this.flyOffSpeed = 0;
			this.drawradians = 0;
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
	if (this.drawradians != 0) {
		var
			charCenter = this.x + (this.imageWidth / 2)
			, charMiddle = this.y + (this.imageHeight / 2);
		ctx.translate(charCenter, charMiddle);
		ctx.rotate(this.drawradians * Math.PI / 180);
		ctx.drawImage(
		    Resources.get(this.sprite)
		    , -1 * this.imageWidth / 2
		    , -1 * this.imageHeight / 2
		    , this.imageWidth
		    , this.imageHeight
		);
		ctx.rotate(-1 * this.drawradians * Math.PI / 180);
		ctx.translate(-1 * charCenter, -1 * charMiddle);
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
	new Enemy('bug', 400)
	, new Enemy('bug', 500)
	, new Enemy('bug', 600)
];

var player = new Player();

var startScreen = new StartScreen();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down',
		13: 'enter'
	};
	if (startScreen.show) {
		startScreen.handleInput(allowedKeys[e.keyCode]);
	} else {
		player.handleInput(allowedKeys[e.keyCode]);
	}
});

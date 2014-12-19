/**
  * This object contains details about the images in the game. It allows images
  * with varying attributes to be swapped out for one another.
*/
var appCharacters = {
	'boy': {
		sprite: 'images/char-boy.png'
		, centerX: 51
		, centerY: 101
		, offsetLeft: 16
		, offsetRight: 86
		, offsetTop: 62
		, offsetBottom: 136
	}
	, 'cat-girl': {
		sprite: 'images/char-cat-girl.png'
		, centerX: 50
		, centerY: 100
		, offsetLeft: 15
		, offsetRight: 86
		, offsetTop: 60
		, offsetBottom: 136
	}
	, 'horn-girl': {
		sprite: 'images/char-horn-girl.png'
		, centerX: 49
		, centerY: 100
		, offsetLeft: 6
		, offsetRight: 86
		, offsetTop: 60
		, offsetBottom: 136
	}
	, 'pink-girl': {
		sprite: 'images/char-pink-girl.png'
		, centerX: 51
		, centerY: 101
		, offsetLeft: 12
		, offsetRight: 90
		, offsetTop: 61
		, offsetBottom: 138
	}
	, 'princess-girl': {
		sprite: 'images/char-princess-girl.png'
		, centerX: 51
		, centerY: 96
		, offsetLeft: 12
		, offsetRight: 90
		, offsetTop: 51
		, offsetBottom: 142
	}
	, 'bug': {
		sprite: 'images/enemy-bug.png'
		, centerX: 50
		, centerY: 109
		, offsetLeft: 0
		, offsetRight: 100
		, offsetTop: 76
		, offsetBottom: 142
	}
};

/**
  * This object manages the start screen and builds the appropriate
  * players and enemies once hte game is ready to go.
*/
var StartScreen = function() {
	this.characterArray = [];
	this.characterCurrent = 0;
	this.characterSpacingRadians = 0;
	this.queueRadians = 0;
	this.characterSpacingRadians = 0;
	this.show = true;
};

/**
  * This function renders elements for the start screen, applying any
  * rotation queued up by the user.
*/
StartScreen.prototype.render = function(dt) {
	var
		i
		, radians
		, char
		, radianIncrement;

	// The first time we execute this code, set some object instance variables.
	if (this.characterArray.length === 0) {
		this.buildCharacterArray();
	}

	// This section monitors for rotation radians in the queue and
	// sets any necessary rotation to incrementally reduce it.
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

	// Set up the start screen.
	ctx.clearRect(0, 0, 505, 606);
	ctx.drawImage(
		Resources.get('images/Selector.png')
		, 200
		, 20
	);
	ctx.font = "16pt Impact"
	ctx.textAlign = 'center';
	ctx.fillStyle = 'black';
	ctx.fillText(
	    'Select player using left/right keys.'
	    , 245
	   	, 75
	);

	// If the rotation has stopped, tell the user how to start the game.
	if (radianIncrement === 0) {
		ctx.fillText(
		    'Press enter to start.'
		    , 255
		   	, 290
		);
	}

	// Draw the characters to the screen appling any necessary rotation.
	for (i = 0; i < this.characterArray.length; i++) {
		this.characterArray[i].radians += radianIncrement;
	    char = this.characterArray[i];
		ctx.drawImage(
			Resources.get(char.sprite)
			, 250 + (150 * Math.cos(char.radians)) - char.centerX
			, 300 + (150 * Math.sin(char.radians)) - char.centerY
		);
	}
};

/**
  * This builds the character array used by the start screen, setting
  * their initial positions.
*/
StartScreen.prototype.buildCharacterArray = function() {
	// Count the characters in the App Characters object.
	var characterCount = 0;
	for (i in appCharacters) {
		characterCount++;
	}
	// Calculate the character spacing in radians.
	this.characterSpacingRadians = Math.PI * 2 / characterCount;
	// Set the initial character's radians to 270 degrees (straight up) from the 0 axis.
	radians = Math.PI * 1.5;
	// Iterate over the characters adding them to our array.
	for (i in appCharacters) {
		char = appCharacters[i];
		this.characterArray.push({
			name: i
			, sprite: char.sprite
			, radians: radians
			, centerX: char.centerX
			, centerY: char.centerY
		});
		radians += this.characterSpacingRadians;
	}
};

StartScreen.prototype.handleInput = function(key) {
	switch(key) {
		case 'enter':
			// Only allow the game to begin if the rotation has stopped.
			if (this.queueRadians === 0) {
				allEnemies.splice(0, allEnemies.length);
				player.setCharacter(this.characterArray[this.characterCurrent].name);
				if (this.characterArray[this.characterCurrent].name === 'bug') {
					// Make enemies of all the other characters
					for (var i = 0; i < this.characterArray.length; i++) {
						if (this.characterArray[i].name != 'bug') {
							allEnemies.push(new Enemy(this.characterArray[i].name, 300 + (i * 100)));
						}
					}
				} else {
					// Create a number of bug enemies equal to the count of the non-bug characters.
					for (var i = 0; i < this.characterArray.length; i++) {
						if (this.characterArray[i].name != 'bug') {
							allEnemies.push(new Enemy('bug', 300 + (i * 100)));
						}
					}
				}
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
	this.offsetLeft = 0;
	this.offsetRight = 0;
	this.offsetTop = 0;
	this.offsetBottom = 0;
	this.offScreenLeft = 0;
	this.offScreenRight = 0;
};

Character.prototype.getCharacterLeftEdge = function() {
	return this.x + this.offsetLeft;
};

Character.prototype.getCharacterRightEdge = function() {
	return this.x + this.offsetRight;
};

Character.prototype.getCharacterTopEdge = function() {
	return this.y + this.offsetTop;
};

Character.prototype.getCharacterBottomEdge = function() {
	return this.y + this.offsetBottom;
};

// Enemies our player must avoid
var Enemy = function(character, speed) {
	this.sprite = appCharacters[character].sprite;
	this.centerX = appCharacters[character].centerX;
	this.centerY = appCharacters[character].centerY;
	this.offsetTop = appCharacters[character].offsetTop;
	this.offsetBottom = appCharacters[character].offsetBottom;
	this.offsetLeft = appCharacters[character].offsetLeft;
	this.offsetRight = appCharacters[character].offsetRight;
	this.offScreenLeft = -100
	this.offScreenRight = 650;
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
	this.y = 172 + (Math.floor((Math.random() * 3)) * 83) - this.centerY;
	this.x = this.offScreenLeft;
};



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
	this.flyOffSpeed = 0;
	this.rotationAngle = 0;
	this.minX = 0;
	this.maxX = 400;
	this.minY = 0;
	this.maxY = 400;
};

Player.prototype = Object.create(Character.prototype);

Player.prototype.setCharacter = function(character){
	this.sprite = appCharacters[character].sprite;
	this.startX = 200;
	this.startY = 505 - appCharacters[character].centerY;
	this.startColumn = 3;
	this.startRow = 6;
	this.currentColumn = 3;
	this.currentRow = 6;
	this.centerX = appCharacters[character].centerX;
	this.centerY = appCharacters[character].centerY;
	this.offsetLeft = appCharacters[character].offsetLeft;
	this.offsetRight = appCharacters[character].offsetRight;
	this.offsetTop = appCharacters[character].offsetTop;
	this.offsetBottom = appCharacters[character].offsetBottom;
	this.offScreenRight = 600;
	this.imageHeight = 171;
	this.imageWidth = 101;
	this.flyOffSpeed = 0;
	this.rotationAngle = 0;
	this.showInstructions = true;
	this.lives = 3;
	this.gems = [{
			sprite: 'images/Gem Blue.png'
			, x: 441
			, y: 70
			, startX: 441
			, startY: 70
			, acquiredX: 8
			, acquiredY: 540
			, pickupColumn: 5
			, pickupRow: 1
			, rockX: 400
			, rockY: 40
		}
		, {
			sprite: 'images/Gem Green.png'
			, x: 241
			, y: 70
			, startX: 241
			, startY: 70
			, acquiredX: 40
			, acquiredY: 540
			, pickupColumn: 3
			, pickupRow: 1
			, rockX: 200
			, rockY: 40
		}
		, {
			sprite: 'images/Gem Orange.png'
			, x: 41
			, y: 70
			, startX: 41
			, startY: 70
			, acquiredX: 72
			, acquiredY: 540
			, pickupColumn: 1
			, pickupRow: 1
			, rockX: 0
			, rockY: 40
		}
	];
	this.gemMoveX = 0;
	this.gemMoveY = 0;
	this.currentGem = 0;
	this.gemInHand = false;
	this.resetToStart();
}

Player.prototype.resetToStart = function() {
	this.x = this.startX;
	this.y = this.startY;
	this.currentColumn = this.startColumn;
	this.currentRow = this.startRow;
	this.gems[this.currentGem].x = this.gems[this.currentGem].startX;
	this.gems[this.currentGem].y = this.gems[this.currentGem].startY;
	this.gemInHand = false;
};

Player.prototype.update = function(dt) {
	var
		i;

	if (this.flyOffSpeed > 0) {
		if (this.x < this.offScreenRight) {
			// Make the player fly off screen to the right.
			this.x += dt * this.flyOffSpeed;
			this.y -= dt * 50;
			this.rotationAngle += dt * 600;
		} else {
			this.flyOffSpeed = 0;
			this.rotationAngle = 0;
			// Reset all enemies.
			for (i = 0; i < allEnemies.length; i++) {
				allEnemies[i].stopped = false;
				allEnemies[i].getRandomStart();
			}
			this.lives--;
			this.resetToStart();
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
		// Determine if we've grabbed the gem.
		if (this.gemInHand === false) {
			if (this.currentColumn === this.gems[this.currentGem].pickupColumn
			    && this.currentRow === this.gems[this.currentGem].pickupRow) {
				this.gemInHand = true;
				this.gems[this.currentGem].y = 90;
				this.gems[this.currentGem].pickupColumn = -1;
				this.gems[this.currentGem].pickupRow = -1;
			}
		} else if (this.gems[this.currentGem].y > 400 && this.gemMoveX === 0 && this.gemMoveY === 0) {
			this.gemInHand = false;
			this.gemMoveX = (this.gems[this.currentGem].x - this.gems[this.currentGem].acquiredX) * dt;
			this.gemMoveY = (this.gems[this.currentGem].y - this.gems[this.currentGem].acquiredY) * dt;
		}
	}

};

Player.prototype.render = function() {
	var
		i
		, diff;
	// Draw the keys representing player lives on the bottom to the screen.
	for (i = 0; i < this.lives; i++) {
		ctx.drawImage(
		    Resources.get('images/Key.png')
		    , 455 - (i * 32)
		    , 527
		    , 65
		    , 65
		);
	}
	// Draw any acquired gems.
	for (i = 0; i < this.currentGem; i++) {
		ctx.drawImage(
		    Resources.get(this.gems[i].sprite)
		    , 8 + (i * 32)
		    , 540
		    , 25
		    , 40
		);
	}
	// Draw the rock where the target gem will rest.
	ctx.drawImage(
	    Resources.get('images/Rock.png')
	    , this.gems[this.currentGem].rockX
	    , this.gems[this.currentGem].rockY
	    , 100
	    , 100
	);

	if (this.lives === 0) {
		// Display the character selection instructions on the screen.
		ctx.font = "normal normal 50px arial"
		ctx.textAlign = 'center';
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
		ctx.fillStyle = 'white';
		ctx.fillText(
		    'Game Over'
		    , 245
		   	, 240
		);
		ctx.strokeText(
		    'Game Over'
		    , 245
		   	, 240
		);
		ctx.font = "normal normal 45px arial"
		ctx.fillText(
		    'Press enter to continue'
		    , 245
		   	, 340
		);
		ctx.strokeText(
		    'Press enter to continue'
		    , 245
		   	, 340
		);
	} else {
		if (this.showInstructions) {
			ctx.font = "normal normal 35px arial"
			ctx.textAlign = 'center';
			ctx.strokeStyle = 'blue';
			ctx.lineWidth = 1;
			ctx.fillStyle = 'black';
			ctx.fillText(
			    'Retrieve the gem'
			    , 248
			   	, 185
			);
			ctx.strokeText(
			    'Retrieve the gem'
			    , 248
			   	, 185
			);
			ctx.fillText(
			    'and bring it back.'
			    , 248
			   	, 268
			);
			ctx.strokeText(
			    'and bring it back.'
			    , 248
			   	, 268
			);
			ctx.fillText(
			    'Avoid the traffic'
			    , 248
			   	, 351
			);
			ctx.strokeText(
			    'Avoid the traffic'
			    , 248
			   	, 351
			);
			ctx.fillText(
			    'and the water.'
			    , 248
			   	, 434
			);
			ctx.strokeText(
			    'and the water.'
			    , 248
			   	, 434
			);
		}
		if (this.rotationAngle != 0) {
			ctx.translate(this.x + this.centerX, this.y + this.centerY);
			ctx.rotate(this.rotationAngle * Math.PI / 180);
			ctx.drawImage(
			    Resources.get(this.sprite)
			    , -1 * this.centerX
			    , -1 * this.centerY
			);
			ctx.rotate(-1 * this.rotationAngle * Math.PI / 180);
			ctx.translate(-1 * (this.x + this.centerX), -1 * (this.y + this.centerY));
		} else {
			ctx.drawImage(
			    Resources.get(this.sprite)
			    , this.x
			    , this.y
			);
		}
	}
	if (this.flyOffSpeed === 0) {
		// Draw the current target gem.
		if (this.gemMoveX != 0) {
			diff = this.gems[this.currentGem].x - this.gems[this.currentGem].acquiredX;
			if (Math.abs(diff) <= Math.abs(this.gemMoveX)) {
				this.gems[this.currentGem].x = this.gems[this.currentGem].acquiredX;
				this.gemMoveX = 0;
			} else {
				this.gems[this.currentGem].x -= this.gemMoveX;
			}
		}
		if (this.gemMoveY != 0) {
			diff = this.gems[this.currentGem].y - this.gems[this.currentGem].acquiredY;
			if (Math.abs(diff) <= Math.abs(this.gemMoveY)) {
				this.gems[this.currentGem].y = this.gems[this.currentGem].acquiredY;
				this.gemMoveY = 0;
				this.currentGem++;
			} else {
				this.gems[this.currentGem].y -= this.gemMoveY;
			}
		}
		ctx.drawImage(
		    Resources.get(this.gems[this.currentGem].sprite)
		    , this.gems[this.currentGem].x
		    , this.gems[this.currentGem].y
		    , 25
		    , 40
		);
	}
};

Player.prototype.handleInput = function(key) {
	switch(key) {
		case 'enter':
			if (this.lives === 0) {
				startScreen.show = true;
			}
			break;
		case 'up':
			if (this.y > this.minY && this.flyOffSpeed === 0) {
				this.y -= 83;
				this.currentRow--;
				if (this.gemInHand === true) {
					this.gems[this.currentGem].y -= 83;
				}
			}
			this.showInstructions = false;
			break;
		case 'down':
			if (this.y < this.maxY && this.flyOffSpeed === 0) {
				this.y += 83;
				this.currentRow++;
				if (this.gemInHand === true) {
					this.gems[this.currentGem].y += 83;
				}
			}
			this.showInstructions = false;
			break;
		case 'left':
			if (this.x > this.minX && this.flyOffSpeed === 0) {
				this.x -= 101;
				this.currentColumn--;
				if (this.gemInHand === true) {
					this.gems[this.currentGem].x -= 101;
				}
			}
			this.showInstructions = false;
			break;
		case 'right':
			if (this.x < this.maxX && this.flyOffSpeed === 0) {
				this.x += 101;
				this.currentColumn++;
				if (this.gemInHand === true) {
					this.gems[this.currentGem].x += 101;
				}
			}
			this.showInstructions = false;
			break;
	}
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

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

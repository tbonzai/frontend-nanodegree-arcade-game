
var
	livesAllowed = 3
	, livesRemaining = 3
	, showStartScreen = true
	, showInstructions = true
	, showStarburst = true
	, playerDrown = false
	, consumeLife = false
	, selectedCharacter = '';


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
		, centerX: 51
		, centerY: 100
		, offsetLeft: 15
		, offsetRight: 86
		, offsetTop: 60
		, offsetBottom: 136
	}
	, 'horn-girl': {
		sprite: 'images/char-horn-girl.png'
		, centerX: 51
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
	this._chars = [];
	this._characterCurrent = 0;
	this._spacingInRadians = 0;
	this._queueRadians = 0;
	this._radianIncrement = 0;
};

StartScreen.prototype.update = function(dt) {
	var i;

	// The first time we execute this code, set some object instance variables.
	if (this._chars.length === 0) {
		this.buildCharacterArray();
	}

	// This section monitors for rotation radians in the queue and
	// sets any necessary rotation to incrementally reduce it.
	if (this._queueRadians > this._spacingInRadians * dt * 2) {
		this._radianIncrement = this._spacingInRadians * dt * 2;
		this._queueRadians -= this._spacingInRadians * dt * 2;
	} else if (this._queueRadians > 0) {
		this._radianIncrement = this._queueRadians;
		this._queueRadians = 0;
	} else if (this._queueRadians < (this._spacingInRadians * dt * -2)) {
		this._radianIncrement = this._spacingInRadians * dt * -2;
		this._queueRadians += this._spacingInRadians * dt * 2;
	} else if (this._queueRadians < 0) {
		this._radianIncrement = this._queueRadians;
		this._queueRadians = 0;
	} else {
		this._radianIncrement = 0;
	}
}

/**
  * This function renders elements for the start screen, applying any
  * rotation queued up by the user.
*/
StartScreen.prototype.render = function() {
	var
		i
		, char;

	// Set up the start screen.
	ctx.clearRect(0, 0, 505, 606);
	ctx.drawImage(Resources.get('images/Selector.png'), 200, 50);
	ctx.font = "16pt Impact"
	ctx.textAlign = 'center';
	ctx.fillStyle = 'black';
	ctx.fillText('Select player using left/right keys.', 245, 75);

	// Draw the characters to the screen appling any necessary rotation.
	for (i = 0; i < this._chars.length; i++) {
		this._chars[i].radians += this._radianIncrement;
	    char = this._chars[i];
		ctx.drawImage(
			Resources.get(char.sprite)
			, 250 + (150 * Math.cos(char.radians)) - char.centerX
			, 300 + (150 * Math.sin(char.radians)) - char.centerY
		);
	}

	// If the rotation has stopped, tell the user how to start the game.
	if (this._radianIncrement === 0) {
		ctx.fillText('Press enter to start.', 255, 290);
	}
};

/**
  * This builds the character array used by the start screen, setting
  * their initial positions.
*/
StartScreen.prototype.buildCharacterArray = function() {
	// Count the characters in the App Characters object.
	var
		characterCount = 0
		, i
		, radians;

	for (i in appCharacters) {
		characterCount++;
	}
	// Calculate the character spacing in radians.
	this._spacingInRadians = Math.PI * 2 / characterCount;
	// Set the initial character's radians to 270 degrees (straight up) from the 0 axis.
	radians = Math.PI * 1.5;
	// Iterate over the characters adding them to our array.
	for (i in appCharacters) {
		char = appCharacters[i];
		this._chars.push({
			name: i
			, sprite: char.sprite
			, radians: radians
			, centerX: char.centerX
			, centerY: char.centerY
		});
		radians += this._spacingInRadians;
	}
};

StartScreen.prototype.handleInput = function(key) {
	switch(key) {
		case 'enter':
			// Only allow the game to begin if the rotation has stopped.
			if (this._queueRadians === 0) {
				selectedCharacter = this._chars[this._characterCurrent].name;
			}
			break;
		case 'right':
			if (this._characterCurrent > 0) {
				this._characterCurrent--;
			} else {
				this._characterCurrent = this._chars.length - 1;
			}
			this._queueRadians += this._spacingInRadians;
			break;
		case 'left':
			if (this._characterCurrent < this._chars.length - 1) {
				this._characterCurrent++;
			} else {
				this._characterCurrent = 0;
			}
			this._queueRadians -= this._spacingInRadians;
			break;

	}
};


/**
  * This object manages the star burst screen.
*/
var StarBurst = function() {
	this._stars = [];
	this._starCount = 5;
	this._spacingInRadians = 0;
	this._queueRadians = 0;
	this._radianIncrement = 0;
};

StarBurst.prototype.update = function(dt) {
	var i;

	// The first time we execute this code, set some object instance variables.
	if (this._stars.length === 0) {
		this.buildStarArray();
	}

	// This section monitors for rotation radians in the queue and
	// sets any necessary rotation to incrementally reduce it.
	if (this._queueRadians > this._spacingInRadians * dt * 2) {
		this._radianIncrement = this._spacingInRadians * dt * 2;
		this._queueRadians -= this._spacingInRadians * dt * 2;
	} else if (this._queueRadians > 0) {
		this._radianIncrement = this._queueRadians;
		this._queueRadians = 0;
	} else if (this._queueRadians < (this._spacingInRadians * dt * -2)) {
		this._radianIncrement = this._spacingInRadians * dt * -2;
		this._queueRadians += this._spacingInRadians * dt * 2;
	} else if (this._queueRadians < 0) {
		this._radianIncrement = this._queueRadians;
		this._queueRadians = 0;
	} else {
		this._radianIncrement = 0;
	}
}

/**
  * This function renders elements for the start burst screen.
*/
StarBurst.prototype.render = function() {
	var
		i
		, char;

	// Set up the start screen.
	ctx.clearRect(0, 0, 505, 606);
	ctx.drawImage(Resources.get('images/Selector.png'), 200, 50);
	ctx.font = "16pt Impact"
	ctx.textAlign = 'center';
	ctx.fillStyle = 'black';
	ctx.fillText('Select player using left/right keys.', 245, 75);

	// Draw the characters to the screen appling any necessary rotation.
	for (i = 0; i < this._chars.length; i++) {
		this._chars[i].radians += this._radianIncrement;
	    char = this._chars[i];
		ctx.drawImage(
			Resources.get(char.sprite)
			, 250 + (150 * Math.cos(char.radians)) - char.centerX
			, 300 + (150 * Math.sin(char.radians)) - char.centerY
		);
	}

	// If the rotation has stopped, tell the user how to start the game.
	if (this._radianIncrement === 0) {
		ctx.fillText('Press enter to start.', 255, 290);
	}
};

/**
  * This builds the star array used by the star burst screen, setting
  * their initial positions.
*/
StarBurst.prototype.buildStarArray = function() {
	// Count the characters in the App Characters object.
	var
		i
		, radians;

	// Calculate the star spacing in radians.
	this._spacingInRadians = Math.PI * 2 / this._starCount;
	// Set the initial star's radians to 270 degrees (straight up) from the 0 axis.
	radians = Math.PI * 1.5;
	// Clear any existing stars.
	this._stars.splice(0, this._starCount);
	// Create new stars.
	for (i = 0; i < this._starCount; i++) {
		this._stars.push({
			radians: radians
			, rotation: 0
			, x: 0
			, y: 0
			, centerX: 50
			, centerY: 101
			, offsetCenterX: 50
			, offsetCenterY: 101
		});
		radians += this._spacingInRadians;
	}
};

StarBurst.prototype.handleInput = function(key) {
	switch(key) {
		case 'enter':
			// Only allow the game to begin if the rotation has stopped.
			if (this._queueRadians === 0) {
				selectedCharacter = this._chars[this._characterCurrent].name;
			}
			break;
		case 'right':
			if (this._characterCurrent > 0) {
				this._characterCurrent--;
			} else {
				this._characterCurrent = this._chars.length - 1;
			}
			this._queueRadians += this._spacingInRadians;
			break;
		case 'left':
			if (this._characterCurrent < this._chars.length - 1) {
				this._characterCurrent++;
			} else {
				this._characterCurrent = 0;
			}
			this._queueRadians -= this._spacingInRadians;
			break;

	}
};


/**
  * This is a super class from which all game characters will inherit methods and properties.
*/
var Character = function() {
	this._x = 0;
	this._y = 0;
	this._startX = 0;
	this._startY = 0;
	this._minX = 0;
	this._maxX = 0;
	this._minY = 0;
	this._maxY = 0;
	this._offsetLeft = 0;
	this._offsetRight = 0;
	this._offsetTop = 0;
	this._offsetBottom = 0;
	this._offScreenLeft = 0;
	this._offScreenRight = 0;
};

Character.prototype.getCharacterLeftEdge = function() {
	return this._x + this._offsetLeft;
};

Character.prototype.getCharacterRightEdge = function() {
	return this._x + this._offsetRight;
};

Character.prototype.getCharacterTopEdge = function() {
	return this._y + this._offsetTop;
};

Character.prototype.getCharacterBottomEdge = function() {
	return this._y + this._offsetBottom;
};

// Enemies our player must avoid
var Enemy = function(character, speed) {
	this._sprite = appCharacters[character].sprite;
	this._x = 0;
	this._y = 0;
	this._centerX = appCharacters[character].centerX;
	this._centerY = appCharacters[character].centerY;
	this._offsetTop = appCharacters[character].offsetTop;
	this._offsetBottom = appCharacters[character].offsetBottom;
	this._offsetLeft = appCharacters[character].offsetLeft;
	this._offsetRight = appCharacters[character].offsetRight;
	this._offScreenLeft = -100
	this._offScreenRight = 650;
	this._speed = speed;
	this._stopped = false;
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
	if (!this._stopped) {
		if (this._x < this._offScreenRight) {
			this._x += dt * this._speed;
		} else {
			this.getRandomStart();
		}
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this._sprite), this._x, this._y);
};

Enemy.prototype.getRandomStart = function() {
	// The lanes start at y coordinate 62 and have an 83px spacing.
	this._y = 172 + (Math.floor(Math.random() * 3) * 83) - this._centerY;
	this._x = this._offScreenLeft - (Math.floor(Math.random() * 100) + 1);
};

Enemy.prototype.getSpeed = function() {
	return this._speed;
};

Enemy.prototype.setStopped = function() {
	this._stopped = true;
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
	this._flyOffSpeed = 0;
	this._rotationAngle = 0;
	this._waterDepth = 0;
	this._minX = 0;
	this._maxX = 400;
	this._minY = 0;
	this._maxY = 400;
};

Player.prototype = Object.create(Character.prototype);

Player.prototype.setCharacter = function(character){
	this._sprite = appCharacters[character].sprite;
	this._startX = 200;
	this._startY = 505 - appCharacters[character].centerY;
	this._startColumn = 3;
	this._startRow = 6;
	this._currentColumn = 3;
	this._currentRow = 6;
	this._centerX = appCharacters[character].centerX;
	this._centerY = appCharacters[character].centerY;
	this._offsetLeft = appCharacters[character].offsetLeft;
	this._offsetRight = appCharacters[character].offsetRight;
	this._offsetTop = appCharacters[character].offsetTop;
	this._offsetBottom = appCharacters[character].offsetBottom;
	this._offScreenRight = 600;
	this._imageHeight = 171;
	this._imageWidth = 101;
	this._flyOffSpeed = 0;
	this._rotationAngle = 0;
	this._waterDepth = 0;
	this.resetToStart();
}

Player.prototype.isDying = function () {
	return this._flyOffSpeed != 0 || this._waterDepth != 0;
}

Player.prototype.setFlyoff = function(speed) {
	this._flyOffSpeed = speed;
}

Player.prototype.isFlyingOff = function () {
	return this._flyOffSpeed != 0;
}

Player.prototype.isDrowning = function () {
	return this._waterDepth != 0;
}

Player.prototype.getWaterDepth = function() {
	return this._waterDepth;
}

Player.prototype.getCurrentColumn = function() {
	return this._currentColumn;
}

Player.prototype.getCurrentRow = function() {
	return this._currentRow;
}

Player.prototype.checkDrowning = function(allowedColumn) {
	if (this._currentColumn != allowedColumn && this._currentRow === 1) {
		// we are on the water.
		this._waterDepth = 1;
	}
}

Player.prototype.resetToStart = function() {
	this._x = this._startX;
	this._y = this._startY;
	this._currentColumn = this._startColumn;
	this._currentRow = this._startRow;
	this._waterDepth = 0;
	this._flyOffSpeed = 0;
	this._rotationAngle = 0;
};

Player.prototype.update = function(dt) {
	var
		i
		, pickupColumn;

	if (this._flyOffSpeed > 0) {
		if (this._x < this._offScreenRight) {
			// Make the player fly off screen to the right.
			this._x += dt * this._flyOffSpeed;
			this._y -= dt * 50;
			this._rotationAngle += dt * 600;
		} else {
			consumeLife = true;
		}
	} else if (this._waterDepth > 0) {
		if ((this._offsetBottom - this._waterDepth) > this._offsetTop) {
			this._waterDepth += 50 * dt;
		} else {
			consumeLife = true;
		}
	}
};

Player.prototype.render = function() {
	var i;

	if (this._rotationAngle != 0) {
		ctx.translate(this._x + this._centerX, this._y + this._centerY);
		ctx.rotate(this._rotationAngle * Math.PI / 180);
		ctx.drawImage(
		    Resources.get(this._sprite)
		    , -1 * this._centerX
		    , -1 * this._centerY
		    , this._imageWidth
		    , this._imageHeight
		);
		ctx.rotate(-1 * this._rotationAngle * Math.PI / 180);
		ctx.translate(-1 * (this._x + this._centerX), -1 * (this._y + this._centerY));
	} else if (this._waterDepth != 0) {
		// Make the player sink into the water.
		ctx.drawImage(
			Resources.get(this._sprite)
			, 0
			, 0
			, this._imageWidth
			, this._offsetBottom - this._waterDepth // shorten the player
			, this._x
			, this._y + this._waterDepth // move player down
			, this._imageWidth
			, this._offsetBottom - this._waterDepth // shorten the player
		);
	} else {
		ctx.drawImage(
		    Resources.get(this._sprite)
		    , this._x
		    , this._y
		    , this._imageWidth
		    , this._imageHeight
		);
	}
};

Player.prototype.handleInput = function(key) {
	if (this._flyOffSpeed === 0 && this._waterDepth === 0) {
		switch(key) {
			case 'enter':
				if (livesRemaining === 0) {
					showStartScreen = true;
				}
				break;
			case 'up':
				if (this._y > this._minY) {
					this._y -= 83;
					this._currentRow--;
				}
				showInstructions = false;
				break;
			case 'down':
				if (this._y < this._maxY) {
					this._y += 83;
					this._currentRow++;
				}
				showInstructions = false;
				break;
			case 'left':
				if (this._x > this._minX) {
					this._x -= 101;
					this._currentColumn--;
				}
				showInstructions = false;
				break;
			case 'right':
				if (this._x < this._maxX) {
					this._x += 101;
					this._currentColumn++;
				}
				showInstructions = false;
				break;
		}
	}
};

var Bubbles = function() {
	this._bubble = [];
	this._bubbleCount = 20;
}

Bubbles.prototype.createBubbles = function() {
	var i;

	// Clear any existing bubbles.
	this._bubble.splice(0, this._bubbleCount);
	// Create new randomized bubbles.
	for (i = 0; i < this._bubbleCount; i++) {
		this._bubble.push({
			offsetX: Math.floor((Math.random() * 70) + 15)
			, radius: Math.floor((Math.random() * 4) + 1)
			, floatSpeed: Math.random() * 5 / 6
		})
	}
}

Bubbles.prototype.render = function(column, waterDepth) {
	var
		i
		, bubble;

	// Draw the bubbles to the screen.
	ctx.fillStyle = '#E6E6FF';
	for (i = 0; i < this._bubbleCount; i++) {
		bubble = this._bubble[i];
		ctx.beginPath();
		ctx.arc(
		    bubble.offsetX + (column - 1) * 101
		    , 125 - (waterDepth * bubble.floatSpeed)
		    , bubble.radius
		    , 0
		    , 2 * Math.PI
		);
		ctx.fill();
	}
}

var Gems = function() {
	this._gem = [{
		sprite: 'images/Gem Blue.png'
		, x: 440
		, y: 70
		, startX: 440
		, startY: 70
		, acquiredX: 8
		, acquiredY: 540
		, pickupColumn: 5
		, pickupRow: 1
		, width: 25
		, height: 40
		, rockX: 404
		, rockY: 40
	}
	, {
		sprite: 'images/Gem Green.png'
		, x: 238
		, y: 70
		, startX: 238
		, startY: 70
		, acquiredX: 40
		, acquiredY: 540
		, pickupColumn: 3
		, pickupRow: 1
		, width: 25
		, height: 40
		, rockX: 202
		, rockY: 40
	}
	, {
		sprite: 'images/Gem Orange.png'
		, x: 36
		, y: 70
		, startX: 36
		, startY: 70
		, acquiredX: 72
		, acquiredY: 540
		, pickupColumn: 1
		, pickupRow: 1
		, width: 25
		, height: 40
		, rockX: 0
		, rockY: 40
	}];
	this._gemMoveX = 0;
	this._gemMoveY = 0;
	this._gemCurrent = 0;
	this._gemInHand = false;
}

Gems.prototype.getPickupColumn = function() {
	if (this._gemCurrent < this._gem.length) {
		return this._gem[this._gemCurrent].pickupColumn;
	}
}

Gems.prototype.update = function(col, row, dt) {
	if (this._gemInHand === true && this._gemCurrent < this._gem.length && this._gemMoveX === 0 && this._gemMoveY === 0) {
		if (this._gem[this._gemCurrent].y > 400) {
			// The gem was in hand and has been moved to the home area. Move it to the acquired zone.
			this._gemInHand = false;
			this._gemMoveX = (this._gem[this._gemCurrent].x - this._gem[this._gemCurrent].acquiredX) * dt;
			this._gemMoveY = (this._gem[this._gemCurrent].y - this._gem[this._gemCurrent].acquiredY) * dt;
		} else {
			this._gem[this._gemCurrent].x = 36 + (col - 1) * 101;
			this._gem[this._gemCurrent].y = 90 + (row - 1) * 83;
		}
	}
}

Gems.prototype.checkPickup = function(col, row) {
	if (this._gemInHand === false && this._gemCurrent < this._gem.length) {
		// The gem is not in hand. Check to see if the player is in a location to pick it up.
		if (col === this._gem[this._gemCurrent].pickupColumn
		    && row === this._gem[this._gemCurrent].pickupRow) {
			this._gemInHand = true;
			this._gem[this._gemCurrent].y = 90;
		}
	}
}

Gems.prototype.resetAll = function() {
	this._gemCurrent = 0;
	this.resetToStart();
}

Gems.prototype.resetToStart = function() {
	this._gem[this._gemCurrent].x = this._gem[this._gemCurrent].startX;
	this._gem[this._gemCurrent].y = this._gem[this._gemCurrent].startY;
	this._gemInHand = false;
}

Gems.prototype.renderAcquired = function() {
	var
		i
		, img;

	for (i = 0; i < this._gemCurrent; i++) {
		img = this._gem[i];
		ctx.drawImage(
		    Resources.get(img.sprite)
		    , img.acquiredX
		    , img.acquiredY
		    , img.width
		    , img.height
		);
	}
}

Gems.prototype.renderTarget = function() {
	if (this._gemCurrent < this._gem.length) {
		if (this._gemMoveX != 0) {
			diff = this._gem[this._gemCurrent].x - this._gem[this._gemCurrent].acquiredX;
			if (Math.abs(diff) <= Math.abs(this._gemMoveX)) {
				this._gem[this._gemCurrent].x = this._gem[this._gemCurrent].acquiredX;
				this._gemMoveX = 0;
			} else {
				this._gem[this._gemCurrent].x -= this._gemMoveX;
			}
		}
		if (this._gemMoveY != 0) {
			diff = this._gem[this._gemCurrent].y - this._gem[this._gemCurrent].acquiredY;
			if (Math.abs(diff) <= Math.abs(this._gemMoveY)) {
				this._gem[this._gemCurrent].y = this._gem[this._gemCurrent].acquiredY;
				this._gemMoveY = 0;
			} else {
				this._gem[this._gemCurrent].y -= this._gemMoveY;
			}
		}
		ctx.drawImage(
		    Resources.get(this._gem[this._gemCurrent].sprite)
		    , this._gem[this._gemCurrent].x
		    , this._gem[this._gemCurrent].y
		    , this._gem[this._gemCurrent].width
		    , this._gem[this._gemCurrent].height
		);

		if (this._gem[this._gemCurrent].x === this._gem[this._gemCurrent].acquiredX
			&& this._gem[this._gemCurrent].x === this._gem[this._gemCurrent].acquiredX) {
			this._gemCurrent++;
		}
	}
}

Gems.prototype.renderRock = function() {
	if (this._gemCurrent < this._gem.length) {
		ctx.drawImage(
		    Resources.get('images/Rock.png')
		    , this._gem[this._gemCurrent].rockX
		    , this._gem[this._gemCurrent].rockY
		    , 100
		    , 100
		);
	}
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

var player = new Player();

var startScreen = new StartScreen();

var gems = new Gems();

var bubbles = new Bubbles();

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
	if (showStartScreen === true) {
		startScreen.handleInput(allowedKeys[e.keyCode]);
	} else {
		player.handleInput(allowedKeys[e.keyCode]);
	}
});

var grid;
var gridSize = 10;
var speed = 150;
var snakeLength;
var movingDirection = "right";
var moveInterval;
var score;
var topten;

var touchstartPosition;


window.onload = function() {
	refreshLeaderboardScreen();
	addDirectionChangeEvents();

	$("#settingsScreen input, #enterLeaderboardScreen input").on("click", function(e) {
		e.target.focus();
	});


	function addDirectionChangeEvents() {
		$(document).on("keydown", function(e) {
			if (e.which == 37) {
				movingDirection = "left";
			}
			else if (e.which == 38) {
				movingDirection = "up";
			}
			else if (e.which == 39) {
				movingDirection = "right";
			}
			else if (e.which == 40) {
				movingDirection = "down";
			}
		});



		window.ontouchstart = function(e) {
			touchstartPosition = {
				x: e.touches[0].clientX,
				y: e.touches[0].clientY
			}
		}
	
		window.ontouchmove = function(e) {
			var touchmovePosition = {
				x: e.changedTouches[0].clientX,
				y: e.changedTouches[0].clientY
			};
	
	
			var xDifference = touchstartPosition.x - touchmovePosition.x;
			var yDifference = touchstartPosition.y - touchmovePosition.y;
			var direction = "none";
	
			if (Math.abs(xDifference) > 50) {
				if (xDifference < 0) {
					movingDirection = "right";
				}
				else {
					movingDirection = "left";
				}
			}
			else if (Math.abs(yDifference) > 50) {
				if (yDifference < 0) {
				movingDirection = "down";
				}
				else {
					movingDirection = "up";
				}
			}
		}
	}
}





var starter = {
	prepare: function() {
		score = 0;

		this.createGrid(gridSize);
		this.createSnake();
		createFood();
		display();

		$(document).on("keydown touchstart", starter.start);
		$(".popup").fadeOut(200);
	},

	createGrid: function(size) {
		grid = [];
		$("#grid > div").remove();

		for (var i=0;i<size*size;i++) {
			grid.push({type:"empty"});
		}

		for (field in grid) {
			var newField = $("<div></div>");

			$("#grid").append(newField);
		}

		$("#grid").css({
			"grid-template-rows": "repeat(" + gridSize + ", 1fr)",
			"grid-template-columns": "repeat(" + gridSize + ", 1fr)"
		});

	},
	createSnake: function() {
		snakeLength = 1;
		grid[gridSize + 1] = {type: "snake", disappearIn: 1, head: true};
	},

	start: function() {
		moveInterval = setInterval(function() {
			if (move(movingDirection)) {
				display();
			}
			else {
				$("#gameOverScoreLabel").text("Score: " + score);
				$("#startScreen").fadeIn(200);
				$("#startScreen h1").text("Game Over");
				$("#startScreen #gameOverScoreLabel").css("display", "block");
				clearInterval(moveInterval);


				if (topten.length < 10) {
					$("#enterLeaderboardScreen").fadeIn(200);
					$("#scoreInput").val(score);
				}
				else {
					for (var i=topten.length-1;i>-1;i--) {
						if (score >= topten[i][1]) {
							$("#enterLeaderboardScreen").fadeIn(200);
							$("#scoreInput").val(score);
							break;
						}
					}
				}
			}
		}, speed);

		$(document).unbind("keydown", starter.start);
		$(document).unbind("touchstart", starter.start);
	}
};




function createFood() {
	var foodCreated = false;

	while (foodCreated == false && score+1 != gridSize*gridSize) {
		var randomNumber = Math.floor(Math.random() * (grid.length));

		if (grid[randomNumber].type == "empty") {
			grid[randomNumber].type = "food";
			foodCreated = true;
		}
	}
}
function growSnake() {
	for (field in grid) {
		if (grid[field].type == "snake") {
			grid[field].disappearIn += 1;
		}
	}

	snakeLength++;
	score++;
	createFood();
}





function move(direction) {
	var currentHeadPosition;
	var nextFieldIndex = false;
	var stillAlive = false;


	for (var i=0;i<grid.length;i++) {
		if(grid[i].type == "snake") {
			if (grid[i].head === true) {
				currentHeadPosition = i;
				grid[i].head = undefined;
			}

	
			grid[i].disappearIn -= 1;

			if (grid[i].disappearIn == 0) {
				grid[i].type = "empty";
				grid[i].disappearIn = undefined;
			}
		}
	}


	if (direction == "up") {
		if (currentHeadPosition >= gridSize) {
			nextFieldIndex = currentHeadPosition - gridSize;
		}
	}
	else if (direction == "right") {
		if (currentHeadPosition % gridSize != gridSize -1) {
			nextFieldIndex = currentHeadPosition + 1;
		}
	}
	else if (direction == "down") {
		if (currentHeadPosition < gridSize * gridSize - gridSize) {
			nextFieldIndex = currentHeadPosition + gridSize;
		}
	}
	else if (direction == "left") {
		if (currentHeadPosition % gridSize != 0) {
			nextFieldIndex = currentHeadPosition - 1;
		}
	}


	if (nextFieldIndex !== false) {
		if (grid[nextFieldIndex].type != "snake") {
			if (grid[nextFieldIndex].type == "food") {
				growSnake();
			}

			grid[nextFieldIndex].type = "snake";
			grid[nextFieldIndex].head = true;
			grid[nextFieldIndex].disappearIn = snakeLength;
			stillAlive = true;
		}
	}

	return stillAlive;
}





function display() {
	$("#grid > div").removeClass();

	for (var i=0;i<grid.length;i++) {
		if (grid[i].type == "snake") {
			$("#grid > div").eq(i).addClass("snake");

			if (grid[i].head == true) {
				$("#grid > div").eq(i).addClass("head");
			}
		}
		if (grid[i].type == "food") {
			$("#grid > div").eq(i).addClass("food");
		}
	}


	$("#scoreLabel").text(score);
}



function enterLeaderboard() {
	var data = {
		name: $("#nameInput").val(),
		score: score
	}


	valid = validate(data.name, data.score);

	if (valid === true) {
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", window.location.href + "enterLeaderboard");
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(JSON.stringify(data));

		closeLeaderboardScreen();
	}
	else {
		$("#statusIndicator").text(valid).css("display", "block");
	}


	function validate(name, score) {
		var valid = true;
		var allowedCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

		if (name.length > 30 || name.length == 0) {
			valid = "The name must be between 1 and 30 characters long.";
		}

		for (letter in name) {
			if (allowedCharacters.indexOf(name[letter]) == -1) {
				valid = "The name must not contain any special characters.";
			}
		}

		if (parseInt(score) != score) {
			valid = "Invalid score";
		}

		return valid
	}
}

function closeLeaderboardScreen() {
	$("#enterLeaderboardScreen").fadeOut(200);
	setTimeout(function() {
		$("#statusIndicator").text("").css("display", "none");
	}, 200);
}



function refreshLeaderboardScreen() {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", window.location.href + "topten");
	xhttp.send();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			topten = JSON.parse(xhttp.responseText);

			$("#leaderboardScreen table").html("");

			for (var i=0;i<topten.length;i++) {
				var row = $("<tr></tr>");
				var position = $("<td>" + (i+1) + "</td>");
				var name = $("<td>" + topten[i][0] + "</td>");
				var score = $("<td>" + topten[i][1] + "</td>");

				$(row).append(position, name, score);
				$("#leaderboardScreen table").append(row);
			}
		}
	};
}

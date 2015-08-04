var people = window.people;
var currentRound = [];

var optionsChosen = [false, false];
var gridSize = 3;
var newGame = true;

$(function () {
	$('#startGame').prop('disabled',true);


	// Grid size
	$('#quickFix').click(function () {
		validateOption(0);
		setGridSize(3);
	});

	$('#halfHour').click(function () {
		validateOption(0);
		setGridSize(4);
	});

	$('#longLayover').click(function () {
		validateOption(0);
		setGridSize(5);
	});

	// Join a game
	$('#joinGame').click(function () {
		validateOption(1);
		showCodeInput();
		setNewGame(false);
	});

	$('#newGame').click(function () {
		validateOption(1);
		hideCodeInput();
		setNewGame(true);
	});

});

//
// Menu
//
function validateOption(index) {
	optionsChosen[index] = true;
	optionsChosen[0] === true && optionsChosen[1] === true &&
		$('#startGame').prop('disabled',false);
}

function showCodeInput() {
	$('#codeInput').removeClass('hidden');
}

function hideCodeInput() {
	$('#codeInput').addClass('hidden');
}

function setGridSize(xy) {
	gridSize = xy;
}

function setNewGame(new) {
	newGame = new;
}

//
// Setup
//
function selectRandomPeople() {
	var numberToPick = gridSize * gridSize;
	var randomIndex;

	for (var iter = 1; iter < numberToPick; iter++) {
		randomIndex = Math.floor(Math.random() * people.length);
		currentRound.push(people.splice(randomIndex, 1)[0]);
	}
}
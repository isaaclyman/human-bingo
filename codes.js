var hb = {};

function resetPeople() {
	hb.people = window.people.slice();
	hb.currentRound = [];
	hb.saveCode = '';
}


hb.optionsChosen = [false, false];
hb.gridSize = 3;
hb.newGame = true;

$(function () {
	$('#startGame').prop('disabled',true);
	resetPeople();

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

	$('#startGame').click(function () {
		selectRandomPeople();
		hideOptions();
		resizeTable();
		fillTable();
		showTable();
	});

	$('#newBoard').click(function () {
		hideTable();
		selectRandomPeople();
		fillTable();
		showTable();
	});

	$('#resetAll').click(function () {
		hideTable();
		resetPeople();
		invalidateOptions();
		unselectButtons();
		showOptions();
	});

	$('td').click(function () {
		toggleShow($(this)[0].firstChild);
	});

});

//
// Menu
//
function validateOption(index) {
	hb.optionsChosen[index] = true;
	hb.optionsChosen[0] === true && hb.optionsChosen[1] === true &&
		$('#startGame').prop('disabled', false);
}

function invalidateOptions() {
	$('#startGame').prop('disabled', true);
	hb.optionsChosen = [false, false];
}

function unselectButtons() {
	$('.btn').removeClass('active');
}

function showCodeInput() {
	$('#codeInput').removeClass('hidden');
}

function hideCodeInput() {
	$('#codeInput').addClass('hidden');
}

function setGridSize(xy) {
	hb.gridSize = xy;
}

function setNewGame(isNew) {
	hb.newGame = isNew;
}

//
// Setup
//
function selectRandomPeople() {
	resetPeople();
	var numberToPick = hb.gridSize * hb.gridSize;
	var randomIndexes = randomUniqueArray(numberToPick, hb.people.length);
	hb.currentRound = randomIndexes.map(function (index) {
		return hb.people[index];
	});
	hb.saveCode = randomIndexes.sort(function (a,b) {
		return a - b;
	}).join('-');
}

function randomUniqueArray(entries, max, array) {
	array = array || [];
	if (!entries)
		return array;
	if (entries > max)
		entries = max;
	var rnd = Math.floor(Math.random() * max);
	if (!~array.indexOf(rnd)) {
		array.push(rnd);
	} else {
		return randomUniqueArray(entries, max, array);
	}
	return randomUniqueArray(entries - 1, max, array);
}

function hideOptions() {
	$('.options-menu').addClass('hidden');
}

function showOptions() {
	$('.options-menu').removeClass('hidden');
}

//
// Game
//
function showTable() {
	$('.game').removeClass('hidden');
}

function hideTable() {
	$('.game').addClass('hidden');
	$('.glyphicon-remove').removeClass('done');
}

function resizeTable() {
	$('td').removeClass('hidden');
	$('tr').removeClass('hidden');
	hb.gridSize < 5 && $('.five').addClass('hidden');
	hb.gridSize < 4 && $('.four').addClass('hidden');
}

function fillTable() {
	var tds = Array.prototype.slice.call($('tr:not(.hidden) td:not(.hidden) span.text'));

	tds.forEach(function (td, index) {
		$(td).text(hb.currentRound[index]);
	});
}

function toggleShow(element) {
	$(element).toggleClass('done');
}
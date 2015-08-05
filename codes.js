var hb = {};

function resetPeople() {
	hb.people = window.people.slice();
	hb.currentRound = [];
	hb.saveCode = null;
	$('#saveCodeText').text(hb.saveCode);
}


hb.optionsChosen = [false, false];
hb.gridSize = 3;
hb.newGame = true;

$(function () {
	$('#startGame').prop('disabled',true);
	resetPeople();

	// Join a game?
	$('#newGame').click(function () {
		invalidateOptions();
		clearSaveCode();
		validateOption(0);
		hideCodeInput();
		showStyleQuestion();
		setNewGame(true);
	});

	$('#joinGame').click(function () {
		invalidateOptions();
		unselectGridSize();
		validateOption(0);
		showCodeInput();
		hideStyleQuestion();
		setNewGame(false);
	});

	$('#saveCodeInput').keyup(function () {
		if (this.value.trim() !== '') {
			validateOption(1);
			hb.saveCode = this.value;
		} else {
			invalidateOptions();
			validateOption(0);
		}
	});

	// Grid size?
	$('#quickFix').click(function () {
		validateOption(1);
		setGridSize(3);
	});

	$('#halfHour').click(function () {
		validateOption(1);
		setGridSize(4);
	});

	$('#longLayover').click(function () {
		validateOption(1);
		setGridSize(5);
	});

	// Start a game
	$('#startGame').click(function () {
		if (hb.saveCode !== null && !hb.newGame) {
			
			loadPeople(hb.saveCode.split('-'));
		} else {
			selectRandomPeople();
		}
		hideOptions();
		hideInvite();
		resizeTable();
		fillTable();
		showTable();
	});

	// In-game buttons
	$('#newBoard').click(function () {
		hideTable();
		selectRandomPeople();
		fillTable();
		showTable();
	});

	$('#resetAll').click(function () {
		hideTable();
		resetPeople();
		hideInvite();
		hideStyleQuestion();
		invalidateOptions();
		unselectButtons();
		clearSaveCode();
		hideCodeInput();
		showOptions();
	});

	$('td').click(function () {
		toggleShow($(this)[0].firstChild);
	});

	$('#inviteFriend').click(function () {
		showInvite();
	});

	$('#copyToClipboard').click(function () {
		SelectText('saveCodeText');
		copyToClipboard();
		showCopySuccess();
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

function unselectGridSize() {
	$('div.styleQuestion label').removeClass('active');
}

function clearSaveCode() {
	$('#saveCodeInput').val('');
}

function showCodeInput() {
	$('#codeInput').removeClass('hidden');
}

function hideCodeInput() {
	$('#codeInput').addClass('hidden');
}

function showStyleQuestion() {
	$('.styleQuestion').removeClass('hidden');
}

function hideStyleQuestion() {
	$('.styleQuestion').addClass('hidden');
}

function setGridSize(xy) {
	hb.gridSize = xy;
	if (xy > 3) {
		$('#saveCodeText').addClass('double-line');
	} else {
		$('#saveCodeText').removeClass('double-line');
	}
}

function setNewGame(isNew) {
	hb.newGame = isNew;
}

//
// Setup
//
function loadPeople(indexes) {
	indexes = indexes || [];
	indexes = indexes.filter(function (index) {
		// Check for NaN
		return Number(index) === Number(index);
	});
	var indexLength = indexes.length;
	if (indexLength < 9) {
		setGridSize(3);
		indexes = randomUniqueArray(9 - indexLength, hb.people.length, indexes);
	} else if (indexLength === 9) {
		setGridSize(3);
	} else if (indexLength < 16) {
		setGridSize(4);
		indexes = randomUniqueArray(16 - indexLength, hb.people.length, indexes);
	} else if (indexLength === 16) {
		setGridSize(4);
	} else if (indexLength > 16 && indexLength < 25) {
		setGridSize(5);
		indexes = randomUniqueArray(25 - indexLength, hb.people.length, indexes);
	} else if (indexLength === 25) {
		setGridSize(5);
	}
	resetPeople();
	indexes = shuffle(indexes);
	setCurrentRound(indexes);
}

function selectRandomPeople() {
	resetPeople();
	var numberToPick = hb.gridSize * hb.gridSize;
	var randomIndexes = randomUniqueArray(numberToPick, hb.people.length);
	setCurrentRound(randomIndexes);
}

function setCurrentRound(indexes) {
	hb.currentRound = indexes.map(function (index) {
		return hb.people[index];
	});
	hb.saveCode = indexes.sort(function (a,b) {
		return a - b;
	}).join('-');
	$('#saveCodeText').text(hb.saveCode);
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

function showInvite() {
	$('#saveCode').toggleClass('hidden');
}

function hideInvite() {
	$('#saveCode').addClass('hidden');
}

function showCopySuccess() {
	var icon = $('#clipboardIcon');
	icon.fadeOut(200, function () {
			icon.removeClass('glyphicon-copy')
			icon.addClass('glyphicon-ok')
		})
		.fadeIn(200)
		.delay(400)
		.fadeOut(200, function () {
			icon.removeClass('glyphicon-ok')
			icon.addClass('glyphicon-copy')
		})
		.fadeIn(200);
}


//
// Utility functions
//
// SelectText by Jason
function SelectText(element) {
    var doc = document, 
    	text = doc.getElementById(element),
    	range,
    	selection;    
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function copyToClipboard() {
	document.execCommand('copy');
}

// Fisher-Yates (Knuth) shuffle by stackoverflow community wiki
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
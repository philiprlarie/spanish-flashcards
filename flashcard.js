// TODO
// get user input from typing. do 2 modes for user types and check string
// do 2 modes for


////////////////////////////////////////////////////////////////
// globals
const words = [];
const incorrectWords = [];
const correctWords = [];
let shouldShowTerm = true;

////////////////////////////////////////////////////////////////
// utility functions
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
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
function getModeFromCookie() {
  const cookieStr = document.cookie;
  const allCookies = cookieStr.split(';');
  const modeCookie = allCookies.find(str => str.match(/^mode=/));

  return modeCookie ? modeCookie.slice(5) : 'term-first';
}

////////////////////////////////////////////////////////////////
// function definitions
function showCard() {
  if (words.length === 0) {
    showEmptyDeck();
    return;
  }

  let currentWord = words[0];
  $('#word').text(currentWord.term);
  $('#definition').text(currentWord.def);
  if (shouldShowTerm) {
    $('#card-definition').hide();
    $('#card-term').show();
  } else {
    $('#card-definition').show();
    $('#card-term').hide();
  }
  $('#deck-count').text(words.length);
  $('#correct-count').text(correctWords.length);
  $('#incorrect-count').text(incorrectWords.length);
  $('#correct,#incorrect').removeAttr('disabled');
}

function showEmptyDeck() {
  $('#definition').text('The current set of words is empty');
  $('#card-definition').show();
  $('#card-term').hide();
  $('#deck-count').text(words.length);
  $('#correct-count').text(correctWords.length);
  $('#incorrect-count').text(incorrectWords.length);
  $('#correct,#incorrect').attr('disabled', 'disabled');
}

function correct() {
  const currentWord = words.shift();
  correctWords.push(currentWord);
  showCard();
}

function incorrect() {
  const currentWord = words.shift();
  incorrectWords.push(currentWord);
  showCard();
}

function flipCard() {
  shouldShowTerm = !shouldShowTerm;
  showCard();
}

function playAudio() {
  const currentWord = words[0];
  const formattedAudioFile = currentWord.audio.replace('/', '-');
  const audioUrl = `https://raw.githubusercontent.com/philiprlarie/spanish-flashcards/master/audio_files/${formattedAudioFile}`;
  $('#pronunciation').attr('src', audioUrl);
  $('#pronunciation').attr('autoplay', true);
}

function resetDeck() {
  words.push(...correctWords);
  correctWords.length = 0;
  words.push(...incorrectWords);
  incorrectWords.length = 0;
  shuffle(words);
  showCard();
}

function termFirstMode() {
  document.cookie = 'mode=term-first';
  shouldShowTerm = true;
  showCard();
}

function defFirstMode() {
  document.cookie = 'mode=def-first';
  shouldShowTerm = false;
  showCard();
}

////////////////////////////////////////////////////////////////
// excecution of code
$('body').hide();
const queryStringParams = decodeURIComponent(window.location.search.slice(1));
const sets = queryStringParams.split('&').map(str => str.slice(7));

console.log(sets);
let numSetsFinished = 0;
sets.forEach(setName => {
  const url = `https://raw.githubusercontent.com/philiprlarie/spanish-flashcards/master/json/flashcards_${setName}.json`;
  $.getJSON(url, json => {
    words.push(...json);
    numSetsFinished++;
    allSetsFetched(numSetsFinished);
  });
})

function allSetsFetched(numFetched) {
  if (numFetched < sets.length) {
    return
  }
  shuffle(words);
  console.log(words);
  switch (getModeFromCookie()) {
    case 'term-first': {
      shouldShowTerm = true;
      break;
    }
    case 'def-first': {
      shouldShowTerm = false;
      break;
    }
    default: {
      shouldShowTerm = true;
    }
  }
  $('body').show();
  showCard();
}

$('#term-first').click(termFirstMode);
$('#def-first').click(defFirstMode);
$('#correct').click(correct);
$('#incorrect').click(incorrect);
$('#reset').click(resetDeck);
$('#audio').click(function(e) {
  e.stopPropagation();
  playAudio();
});
$('#flash-card').click(flipCard);

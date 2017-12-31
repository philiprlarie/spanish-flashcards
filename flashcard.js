// TODO
// get user input from typing. do 2 modes for user types and check string. show correct answer for 2 seconds if you get it wrong
// do 2 modes for audio first
// style it

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
function setShouldShowTerm() {
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
}

////////////////////////////////////////////////////////////////
// globals
const words = [];
const incorrectWords = [];
const correctWords = [];
let shouldShowTerm = true;

////////////////////////////////////////////////////////////////
// function definitions
function showCard() {
  let currentWord = words[0];
  if (words.length === 0) {
    $('#correct,#incorrect').attr('disabled', 'disabled');
    currentWord = { def: 'The current set of words is empty' }
    shouldShowTerm = false;
  } else {
    $('#correct,#incorrect').removeAttr('disabled')
    currentWord = words[0];
  }

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

  $('#settings button').removeAttr('disabled');
  switch (getModeFromCookie()) {
    case 'term-first': {
      $('#term-first').attr('disabled', 'disabled');
      break;
    }
    case 'def-first': {
      $('#def-first').attr('disabled', 'disabled');
      break;
    }
    default:
  }
}

function correct() {
  const currentWord = words.shift();
  correctWords.push(currentWord);
  setShouldShowTerm();
  showCard();
}

function incorrect() {
  const currentWord = words.shift();
  incorrectWords.push(currentWord);
  setShouldShowTerm();
  showCard();
}

function flipCard() {
  shouldShowTerm = !shouldShowTerm;
  showCard();
}

function playAudio() {
  const currentWord = words[0];
  const formattedAudioFile = currentWord.audio.replace('/', '-');
  const baseUrl = window.location.href.includes('github') ? 'https://raw.githubusercontent.com/philiprlarie/spanish-flashcards/master/audio_files/' : 'audio_files/'
  const audioUrl = `${baseUrl}${formattedAudioFile}`;

  $('#pronunciation').attr('src', audioUrl);
  $('#pronunciation').attr('autoplay', true);
}

function returnIncorrect() {
  words.push(...incorrectWords);
  incorrectWords.length = 0;
  shuffle(words);
  setShouldShowTerm();
  showCard();
}

function resetDeck() {
  words.push(...correctWords);
  correctWords.length = 0;
  words.push(...incorrectWords);
  incorrectWords.length = 0;
  shuffle(words);
  setShouldShowTerm();
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
  const baseUrl = window.location.href.includes('github') ? 'https://raw.githubusercontent.com/philiprlarie/spanish-flashcards/master/json/flashcards_' : 'json/flashcards_';
  const url = `${baseUrl}${setName}.json`;

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
  setShouldShowTerm();
  $('body').show();
  showCard();
}

$('#term-first').click(termFirstMode);
$('#def-first').click(defFirstMode);
$('#correct').click(correct);
$('#incorrect').click(incorrect);
$('#reset').click(resetDeck);
$('#return-incorrect').click(returnIncorrect);
$('#audio').click(function(e) {
  e.stopPropagation();
  playAudio();
});
$('#flash-card').click(flipCard);

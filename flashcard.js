// TODO
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
function setDisplaySettings() {
  switch (getModeFromCookie()) {
    case 'term-first': {
      shouldShowTerm = true;
      shouldShowInputBox = false;
      break;
    }
    case 'def-first': {
      shouldShowTerm = false;
      shouldShowInputBox = false;
      break;
    }
    case 'fill-in-term': {
      shouldShowTerm = false;
      shouldShowInputBox = true;
      break;
    }
    case 'fill-in-def': {
      shouldShowTerm = true;
      shouldShowInputBox = true;
      break;
    }
    default: {
      shouldShowTerm = true;
      shouldShowInputBox = false;
    }
  }
}

////////////////////////////////////////////////////////////////
// globals
const words = [];
const incorrectWords = [];
const correctWords = [];
let shouldShowTerm = true;
let showingCorrectAnswer = false;

////////////////////////////////////////////////////////////////
// function definitions
function showCard() {
  $('#correct-answer').hide();
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
  if (shouldShowInputBox) {
    $('#user-input').show();
    $('input[name="user-input"]').val('');
    if (words.length !== 0) {
      $('input[name="user-input"]').removeAttr('disabled').focus();
    }
    $('#correct,#incorrect').hide();
  } else {
    $('#user-input').hide();
    $('#correct,#incorrect').show();
  }

  $('#deck-count').text(words.length);
  $('#correct-count').text(correctWords.length);
  $('#incorrect-count').text(incorrectWords.length);

  $('#settings button').removeAttr('disabled');
  $(`#${getModeFromCookie()}`).attr('disabled', 'disabled');
}

function correct() {
  const currentWord = words.shift();
  correctWords.push(currentWord);
  setDisplaySettings();
  showCard();
}

function incorrect() {
  const currentWord = words.shift();
  incorrectWords.push(currentWord);
  setDisplaySettings();
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
  setDisplaySettings();
  showCard();
}

function resetDeck() {
  words.push(...correctWords);
  correctWords.length = 0;
  words.push(...incorrectWords);
  incorrectWords.length = 0;
  shuffle(words);
  setDisplaySettings();
  showCard();
}

function termFirstMode() {
  document.cookie = 'mode=term-first';
  shouldShowTerm = true;
  shouldShowInputBox = false;
  showCard();
}

function defFirstMode() {
  document.cookie = 'mode=def-first';
  shouldShowTerm = false;
  shouldShowInputBox = false;
  showCard();
}

function fillInDefMode() {
  document.cookie = 'mode=fill-in-def';
  shouldShowTerm = true;
  shouldShowInputBox = true;
  showCard();
}

function fillInTermMode() {
  document.cookie = 'mode=fill-in-term';
  shouldShowTerm = false;
  shouldShowInputBox = true;
  showCard();
}

function checkUserInput(event, data) {
  event.preventDefault();
  const currentWord = words[0];
  const userString = $('input[name="user-input"]').val();
  let correctAnswer;
  if (getModeFromCookie() === 'fill-in-term') {
    correctAnswer = currentWord.term;
  } else {
    correctAnswer = currentWord.def;
  }
  if (userString === correctAnswer) {
    showCorrectAnswer(correctAnswer, true);
  } else {
    showCorrectAnswer(correctAnswer, false);
  }
}

function showCorrectAnswer(correctAnswer, wasAnsweredCorreclty) {
  if (showingCorrectAnswer) {
    return;
  }
  showingCorrectAnswer = wasAnsweredCorreclty ? 'correct' : 'incorrect';
  $('input[name="user-input"]').attr('disabled', 'disabled');
  $('#card-term,#card-definition').hide();
  $('#correct-answer').show();
  $('#correct-answer p').text(correctAnswer);
  $('#correct-answer p').append('</br>(press "enter" to continue)')
  if (wasAnsweredCorreclty) {
    $('#correct-answer p').css('color', 'green');
  } else {
    $('#correct-answer p').css('color', 'red');
  }
}

function moveToNextAfterIncorrect(event) {
  if (event.keyCode === 13 && !!showingCorrectAnswer) {
    event.preventDefault();
    showingCorrectAnswer = false;
    showingCorrectAnswer === 'incorrect' ? incorrect() : correct();
  }
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
  setDisplaySettings();
  $('body').show();
  showCard();
}

$('#term-first').click(termFirstMode);
$('#def-first').click(defFirstMode);
$('#fill-in-def').click(fillInDefMode);
$('#fill-in-term').click(fillInTermMode);
$('#correct').click(correct);
$('#incorrect').click(incorrect);
$('#reset').click(resetDeck);
$('#return-incorrect').click(returnIncorrect);
$('#audio').click(playAudio);
$('#flash-card').click(flipCard).find('#audio,#user-input').click(e => false);
$('#user-input-form').submit(checkUserInput);

$('body').keydown(moveToNextAfterIncorrect);

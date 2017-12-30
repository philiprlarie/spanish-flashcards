// TODO
// end reset at end of set
// shuffle mode
// definition/term first mode
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

////////////////////////////////////////////////////////////////
// function definitions
function showCard() {
  let currentWord = words[0];
  if (words.length === 0) {
    currentWord = {
      term: 'The current set of words is empty',
      def: 'The current set of words is empty'
    };
  } else {
    currentWord = words[0];
    shouldShowTerm = false;
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
}

function pickRandomCard() {
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
  $('body').show();
  showCard();
}

$('#correct').click(correct);
$('#incorrect').click(incorrect);
$('#audio').click(function(e) {
  e.stopPropagation();
  playAudio();
});
$('#flash-card').click(flipCard);

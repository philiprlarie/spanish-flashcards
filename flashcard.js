////////////////////////////////////////////////////////////////
// globals
const currentSetName = window.location.search.split('=')[1];
const words = [];
let currentWordIndex = 0;
let shouldShowTerm = true;

////////////////////////////////////////////////////////////////
// function definitions
function showCard() {
  const currentWord = words[currentWordIndex];
  $('#word').text(currentWord.term);
  $('#definition').text(currentWord.def);

  if (shouldShowTerm) {
    $('#card-definition').hide();
    $('#card-term').show();
  } else {
    $('#card-definition').show();
    $('#card-term').hide();
  }
}

function nextWord() {
  if (words.length === 0) {
    window.alert('congrats! you finished the set');
  } else if (currentWordIndex >= words.length - 1) {
    currentWordIndex = 0;
  } else {
    currentWordIndex++;
  }
  showCard();
}

function prevWord() {
  if (words.length === 0) {
    window.alert('congrats! you finished the set');
  } else if (currentWordIndex <= 0) {
    currentWordIndex = words.length - 1;
  } else {
    currentWordIndex--;
  }
  showCard();
}

function removeWord() {
}

function flipCard() {
  shouldShowTerm = !shouldShowTerm;
  showCard();
}

function playAudio() {
  const currentWord = words[currentWordIndex];
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
const queryStringParams = decodeURIComponent(window.location.search.slice(1));
const sets = queryStringParams.split('&').map(str => str.slice(7));

console.log(sets)
let numSetsFinished = 0
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
  console.log(words);
  showCard();
}

$('#previous').click(prevWord);
$('#next').click(nextWord);
$('#audio').click(function(e) {
  e.stopPropagation();
  playAudio();
});
$('#flash-card').click(flipCard);

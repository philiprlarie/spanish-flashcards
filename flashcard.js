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
  debugger
  showCard();
}

// function showDefinition() {
// }
//
// function showTerm() {
//
// }

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

const currentSetName = window.location.search.split('=')[1];
const url = `https://raw.githubusercontent.com/philiprlarie/spanish-flashcards/master/json/flashcards_${currentSetName}.json`;

let words;

$.getJSON(url, json => {
  words = window.words = json;
  showCard();
});

let currentWordIndex = 0;

let shouldShowTerm = true;

$('#previous').click(prevWord);
$('#next').click(nextWord);
$('#audio').click(function(e) {
  e.stopPropagation();
  playAudio();
});
$('#flash-card').click(flipCard);

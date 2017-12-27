
const currentSetName = window.location.search.split('=')[1];
$.getJSON('json/flashcards_01-01.json', json => {
  console.log(json);
})

$.ajax({
  dataType: "json",
  url: 'json/flashcards_01-01.json',
  success: (json) => console.log(json)
});

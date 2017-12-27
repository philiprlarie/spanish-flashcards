const $setList = $('#set-list');
window.ALL_SETS_ARR.forEach((setName) => {
  const [chapter, set] = setName.split('-')
  let linkName = `Chapter ${parseInt(chapter)}, Set number ${parseInt(set)}`;
  let url = `flashcard-set.html?setName=${setName}`
  $setList.append(`<li><a href='${url}'>${linkName}</a></li>`);
});

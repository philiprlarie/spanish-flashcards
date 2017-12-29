const $theForm = $('form');
window.ALL_SETS_ARR.forEach((setName) => {
  const [chapter, set] = setName.split('-')
  let linkName = `Chapter ${parseInt(chapter)}, Set number ${parseInt(set)}`;
  let url = `flashcard-set.html?sets[]=${setName}`
  $theForm.append(`<div><input type="checkbox" value="${setName}" name="sets[]"><a href='${url}'>${linkName}</a></div>`);
});

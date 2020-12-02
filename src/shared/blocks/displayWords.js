export const displayWords = (wordsArray) => {
  if (typeof wordsArray[0] === 'object') {
    wordsArray = wordsArray.map((x) => x.name);
  }
  return wordsArray.length > 1
    ? wordsArray.slice(0, -1).join(', ') + ' y ' + wordsArray.slice(-1)
    : wordsArray.length > 0
    ? wordsArray[0]
    : '';
};

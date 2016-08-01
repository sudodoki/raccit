const alignment = require('./alignment');
const print = require('./print');
function diff(lastSavedContent, newContent) {
  const changes = alignment(lastSavedContent, newContent);
  // console.log(changes);
  print(changes, lastSavedContent, newContent);
}

module.exports = diff;

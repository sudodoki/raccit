const {
  diff,
  getSnapshotedFile,
  getTree,
  raccitFiles,
} = require('../utils');

const diffCmd = (filename, range = '') => {
  const getTwoLastCommits = () => {
    const currentHEAD = raccitFiles.readFrom('HEAD.json');
    return [currentHEAD, getTree(currentHEAD).parent];
  };
  var from; // eslint-disable-line no-var
  var to; // eslint-disable-line no-var
  if (range === '--staged') {
    from = 'INDEX';
    to = raccitFiles.readFrom('HEAD.json');
  } else {
    [from, to] = range
      ? range.split('..')
      : getTwoLastCommits();
  }
  if (filename) {
    diff(getSnapshotedFile(filename, to), getSnapshotedFile(filename, from));
  } else {
    console.log('We are not yet supporting recursive traversal for everything'); // eslint-disable-line no-console
  }
};

module.exports = diffCmd;

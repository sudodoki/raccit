const fs = require('fs');
const path = require('path');

const { diff, getSnapshotedFile, promoteIndexToCommit, getTree, raccitFiles, addFileToIndex, traverse } = require('../utils');

// TODO: support nested files
const isDirty = (file) => {
  const originalFile = path.resolve(file);
  return getSnapshotedFile(file) === fs.readFileSync(originalFile).toString();
};

const statusCmd = (filename) => {
  // TODO: check if anyhting isDirty in the tree
  // TODO: check if anything is staged that wasn't in HEAD commit
  if (filename) {
    if (isDirty(filename)) {
      console.log(`${filename} was changed.`); // eslint-disable-line no-console
    } else {
      console.log(`${filename} wasn't not changed.`); // eslint-disable-line no-console
    }
  }
};

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

const snapshotCmd = ({ message }) => {
  const newCommitId = promoteIndexToCommit({ message });
  if (newCommitId) {
    raccitFiles.writeTo('HEAD.json', newCommitId);
  }
};

const historyCmd = () => {
  const currentHEAD = raccitFiles.readFrom('HEAD.json');
  let currentCommit = currentHEAD;

  while (currentCommit) {
    const commit = getTree(currentCommit);
    // TODO: add padding
    console.log(`${currentCommit}: ${commit.message || 'No message'}`); // eslint-disable-line no-console
    currentCommit = commit.parent;
  }
};

const fileExist = (filename) => {
  try {
    fs.statSync(filename);
    return true;
  } catch (e) {
    return false;
  }
};
// TODO: handle recursive folders
const addCmd = (filename) => {
  if (!filename) {
    console.log('Should specify filename'); // eslint-disable-line no-console
    process.exit(1);
  }
  if (fileExist(filename)) {
    addFileToIndex(filename);
    process.exit(0);
  } else {
    console.log('File does not exit. Exiting now'); // eslint-disable-line no-console
    process.exit(1);
  }
};

const resetCmd = (mode, snapshotId) => {
  if (!snapshotId) {
    console.log('This commands requires snapshot ID'); // eslint-disable-line no-console
    return
  }
  const desiredTree = getTree(snapshotId);
  const allPaths = {};
  traverse.bfs(desiredTree.body, (file, content) => {
    if (content) {
      allPaths[file] = content;
    }
  });
  Object.keys(allPaths).forEach((filepath) => {
    const objectId = allPaths[filepath];
    fs.writeFileSync(filepath, raccitFiles.readFrom(`objects/${objectId}`, { asJSON: false }));
  });
  // if mode == '--hard', reset HEAD to snapshotId, delete everything not in tree (?)
};

module.exports = {
  status: statusCmd,
  diff: diffCmd,
  snapshot: snapshotCmd,
  history: historyCmd,
  add: addCmd,
  reset: resetCmd,
};

const fs = require('fs');
const path = require('path');

const { diff, getSnapshotedFile, promoteIndexToCommit, getTree, raccitFiles, addFileToIndex } = require('../utils');

// TODO: support nested files
const isDirty = (file) => {
  const originalFile = path.resolve(file);
  return getSnapshotedFile(file) === fs.readFileSync(originalFile).toString();
};

const statusCmd = (filename) => {
  // TODO: check if anyhting isDirty in the tree
  // TODO: check if anything is staged that wasn't in HEAD commit
  if (filename) {
    if (!isDirty(filename)) {
      console.log(`${filename} was changed.`); // eslint-disable-line no-console
    }
  }
};

const diffCmd = (filename) => {
  if (filename) {
    if (!isDirty(filename)) {
      const originalFile = path.resolve(filename);
      diff(getSnapshotedFile(filename), fs.readFileSync(originalFile).toString());
    }
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
}
// TODO: handlerecursive folders
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

module.exports = {
  status: statusCmd,
  diff: diffCmd,
  snapshot: snapshotCmd,
  history: historyCmd,
  add: addCmd,
};

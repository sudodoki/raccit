const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const {
  diff,
  getObjectId,
  getSnapshotedFile,
  promoteIndexToCommit,
  getTree,
  raccitFiles,
  addFileToIndex,
  traverse,
} = require('../utils');

/* files */
const fileExist = (filename) => {
  try {
    fs.statSync(filename);
    return true;
  } catch (e) {
    return false;
  }
};

const ignored = ['.raccit'];
const getDirectoryEntries = (pathname = ['.'], sofar = []) => {
  let stats;
  try {
    stats = fs.statSync(pathname.join('/'));
  } catch (e) {
    return null;
  }
  if (stats.isFile()) {
    sofar.push(pathname.join('/'));
  } else {
    fs.readdirSync(pathname.join('/'))
      .filter(child => !ignored.includes(child))
      .filter(child => !!child)
      .map(child => getDirectoryEntries(pathname.concat(child), sofar));
  }
  return sofar;
};

const getSnapsotEntries = (snapshotId = 'INDEX') => {
  const entries = [];
  const tree = getTree(snapshotId);
  traverse.bfs(tree.body, (pathname, isLeaf) => {
    if (isLeaf) { entries.push(pathname); }
  });
  return entries;
}

function differenceInLists(oneList, anotherList) {
  return oneList.filter(entry => !anotherList.includes(entry));
}
// TODO: support nested files
const isDirty = (file) => {
  const originalFile = path.resolve(file);
  return getSnapshotedFile(file, 'INDEX') !== fs.readFileSync(originalFile).toString();
};

const isStaged = (file) => {
  const head = raccitFiles.readFrom('HEAD.json');
  return getObjectId(file, 'INDEX') !== getObjectId(file, head);
};
// const isChanged

const statusCmd = () => {
  const filesOnDisk = getDirectoryEntries();
  const filesInIndex = getSnapsotEntries();

  const notTracked = differenceInLists(filesOnDisk, filesInIndex);
  const deleted = differenceInLists(filesInIndex, filesOnDisk);

  const staged = filesInIndex.filter(entry => isStaged(entry.replace(/^\.\//, '')));
  const notStaged = filesOnDisk.filter(entry => isDirty(entry.replace(/^\.\//, '')));
  if (staged.length) {
    console.log("Changes to be committed:") // eslint-disable-line no-console
    staged.forEach(entry =>
      console.log(chalk.green(`modified: ${entry}`)) // eslint-disable-line no-console
    );
  }
  if (notStaged.length) {
    console.log("Changes not staged for commit:") // eslint-disable-line no-console
    notStaged.forEach(entry =>
      console.log(chalk.red(`modified: ${entry}`)) // eslint-disable-line no-console
    );
  }
  if (notTracked.length) {
    console.log("Not tracked files:"); // eslint-disable-line no-console
    notTracked.forEach(entry =>
      console.log(chalk.red(`modified: ${entry}`)) // eslint-disable-line no-console
    );
  }
  if (deleted.length) {
    console.log("Deleted locally, not commited files:"); // eslint-disable-line no-console
    deleted.forEach(entry =>
      console.log(chalk.red(`deleted: ${entry}`)) // eslint-disable-line no-console
    );
  }
  if ([staged, notStaged, notTracked, deleted].every(list => list.length === 0)) {
    console.log('Nothing to commit, working directory is clean');
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
    return;
  }
  // TODO: rewrite to use getSnapsotEntries
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
  raccitFiles.writeTo('HEAD.json', snapshotId);
  // if mode == '--hard', delete everything not in tree (?), clear index
};

module.exports = {
  status: statusCmd,
  diff: diffCmd,
  snapshot: snapshotCmd,
  history: historyCmd,
  add: addCmd,
  reset: resetCmd,
};

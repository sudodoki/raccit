const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const {
  getObjectId,
  getSnapshotedFile,
  getTree,
  raccitFiles,
  traverse,
} = require('../utils');

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
  traverse.bfs(tree.body, (node, parentPath) => {
    if (node.content) { entries.push(parentPath + node.path); }
  });
  return entries;
};

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
  if (!head) { return true; }
  return getObjectId(file, 'INDEX') !== getObjectId(file, head);
};

const statusCmd = () => {
  const filesOnDisk = getDirectoryEntries();
  const filesInIndex = getSnapsotEntries();

  const notTracked = differenceInLists(filesOnDisk, filesInIndex);
  const deleted = differenceInLists(filesInIndex, filesOnDisk);

  const staged = filesInIndex.filter(entry => isStaged(entry.replace(/^\.\//, '')));
  const notStaged = filesOnDisk.filter(entry => isDirty(entry.replace(/^\.\//, '')));
  if (staged.length) {
    console.log('Changes to be committed:'); // eslint-disable-line no-console
    staged.forEach(entry =>
      console.log(chalk.green(`modified: ${entry}`)) // eslint-disable-line no-console
    );
  }
  if (notStaged.length) {
    console.log('Changes not staged for commit:'); // eslint-disable-line no-console
    notStaged.forEach(entry =>
      console.log(chalk.red(`modified: ${entry}`)) // eslint-disable-line no-console
    );
  }
  if (notTracked.length) {
    console.log('Not tracked files:'); // eslint-disable-line no-console
    notTracked.forEach(entry =>
      console.log(chalk.red(`modified: ${entry}`)) // eslint-disable-line no-console
    );
  }
  if (deleted.length) {
    console.log('Deleted locally, not commited files:'); // eslint-disable-line no-console
    deleted.forEach(entry =>
      console.log(chalk.red(`deleted: ${entry}`)) // eslint-disable-line no-console
    );
  }
  if ([staged, notStaged, notTracked, deleted].every(list => list.length === 0)) {
    console.log('Nothing to commit, working directory is clean'); // eslint-disable-line no-console
  }
};

module.exports = statusCmd;

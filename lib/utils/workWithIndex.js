const fs = require('fs');
const path = require('path');
const sha1 = require('sha1');

const traverse = require('./traverse');
const { readFrom, writeTo, exist } = require('./raccit-files').raccitFiles;

const snapshotPath = snapshotId => `commits/${snapshotId}.json`;

const getTree = (snapshotId) => {
  const treeFile = snapshotId === 'INDEX' ? 'INDEX.json' : snapshotPath(snapshotId);
  return readFrom(treeFile);
};

const saveTree = (snapshotId, tree) => {
  const treeFile = snapshotId === 'INDEX' ? 'INDEX.json' : snapshotPath(snapshotId);
  writeTo(treeFile, tree);
};

const getObjectId = (file, snapshotId = 'INDEX') => {
  const tree = getTree(snapshotId);
  // ugly hack until bfs can do abrupt exit
  let objectId = null;
  traverse.bfs(tree.body, (foundPathName, content) => {
    if (path.normalize(foundPathName) === file) {
      objectId = content;
    }
  });
  return objectId;
};

const getSnapshotedFile = (file, snapshotId) => {
  if (!snapshotId) { throw new Error('getSnapshotedFile: snapshotId should be specified'); }
  const objectId = getObjectId(file, snapshotId);
  if (!objectId || !exist(`objects/${objectId}`)) {
    return '';
  }
  return readFrom(`objects/${objectId}`, { asJSON: false });
};

const promoteIndexToCommit = (metaInfo) => {
  const currentTree = getTree('INDEX');
  const newCommitBody = Object.assign({}, currentTree, metaInfo);
  const newCommitId = sha1(JSON.stringify(newCommitBody));
  if (exist(snapshotPath(newCommitId))) {
    console.log('nothing to commit, exiting'); // eslint-disable-line no-console
    return false;
  }
  const newIndex = Object.assign({}, currentTree, { parent: newCommitId });
  saveTree(newCommitId, newCommitBody);
  saveTree('INDEX', newIndex);
  return newCommitId;
};

const addFileToIndex = (filename) => {
  const content = fs.readFileSync(filename).toString();
  const newObjectId = sha1(content);
  writeTo(`objects/${newObjectId}`, content, { asJSON: false });
  // TODO: change to exist? etc.
  const currentTree = getTree('INDEX');
  const newIndexBody = traverse.setInTree(currentTree.body, ['./'].concat(filename.split(/\//)), newObjectId);
  saveTree('INDEX', Object.assign(currentTree, { body: newIndexBody }));
};

module.exports = {
  getTree,
  getObjectId,
  getSnapshotedFile,
  promoteIndexToCommit,
  addFileToIndex,
};

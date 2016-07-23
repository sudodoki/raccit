const diff = require('./diff');
const traverse = require('./traverse');
const getSnapshotedFile = require('./workWithIndex').getSnapshotedFile;
const promoteIndexToCommit = require('./workWithIndex').promoteIndexToCommit;
const getTree = require('./workWithIndex').getTree;
const getObjectId = require('./workWithIndex').getObjectId;
const addFileToIndex = require('./workWithIndex').addFileToIndex;
const raccitFiles = require('./raccit-files').raccitFiles;
module.exports = {
  diff,
  traverse,
  getObjectId,
  getSnapshotedFile,
  promoteIndexToCommit,
  addFileToIndex,
  getTree,
  raccitFiles,
};

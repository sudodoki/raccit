const alignment = require('./alignment');
const diff = require('./diff');
const print = require('./print');
const traverse = require('./traverse');
const getSnapshotedFile = require('./workWithIndex').getSnapshotedFile;
const promoteIndexToCommit = require('./workWithIndex').promoteIndexToCommit;
const getTree = require('./workWithIndex').getTree;
const getObjectId = require('./workWithIndex').getObjectId;
const addFileToIndex = require('./workWithIndex').addFileToIndex;
const raccitFiles = require('./raccit-files').raccitFiles;
module.exports = {
  alignment,
  diff,
  print,
  traverse,
  getObjectId,
  getSnapshotedFile,
  promoteIndexToCommit,
  addFileToIndex,
  getTree,
  raccitFiles,
};

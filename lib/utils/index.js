const diff = require('./diff-files');
const traverse = require('./trees');
const {
  getSnapshotedFile,
  promoteIndexToCommit,
  getTree,
  getObjectId,
  addFileToIndex,
} = require('./raccit/workWithIndex');
const raccitFiles = require('./raccit/files').raccitFiles;
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

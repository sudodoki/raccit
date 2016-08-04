const diff = require('./diff-files');
const { fileExists } = require('./file-system');

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
  fileExists,
  traverse,
  getObjectId,
  getSnapshotedFile,
  promoteIndexToCommit,
  addFileToIndex,
  getTree,
  raccitFiles,
};

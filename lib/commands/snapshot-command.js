const {
  promoteIndexToCommit,
  raccitFiles,
} = require('../utils');

const snapshotCmd = ({ message }) => {
  const newCommitId = promoteIndexToCommit({ message });
  if (newCommitId) {
    raccitFiles.writeTo('HEAD.json', newCommitId);
  }
};

module.exports = snapshotCmd;

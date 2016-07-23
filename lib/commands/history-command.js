const {
  getTree,
  raccitFiles,
} = require('../utils');


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

module.exports = historyCmd;

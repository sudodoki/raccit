const fs = require('fs');

const {
  getTree,
  raccitFiles,
  traverse,
} = require('../utils');

const resetCmd = (mode, snapshotId) => {
  if (!snapshotId) {
    console.log('This commands requires snapshot ID'); // eslint-disable-line no-console
    return;
  }
  // TODO: rewrite to use getSnapsotEntries
  const desiredTree = getTree(snapshotId);
  const allPaths = {};
  traverse.bfs(desiredTree.body, ({ path: filePath, content }, parentPath) => {
    const key = [...parentPath, filePath].join('');
    if (content) {
      allPaths[key] = content;
    }
  });
  Object.keys(allPaths).forEach((filepath) => {
    const objectId = allPaths[filepath];
    fs.writeFileSync(filepath, raccitFiles.readFrom(`objects/${objectId}`, { asJSON: false }));
  });
  raccitFiles.writeTo('HEAD.json', snapshotId);
  // if mode == '--hard', delete everything not in tree (?), clear index
};

module.exports = resetCmd;

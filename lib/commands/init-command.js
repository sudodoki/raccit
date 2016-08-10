const fs = require('fs');

const { raccitFiles, traverse } = require('../utils');

const initCmd = () => {
  fs.mkdirSync('.raccit');
  fs.mkdirSync('.raccit/commits');
  fs.mkdirSync('.raccit/objects');
  raccitFiles.writeTo('HEAD.json', null);
  raccitFiles.writeTo('Index.json', traverse.createRootNode());
};
module.exports = initCmd;

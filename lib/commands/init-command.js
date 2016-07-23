const fs = require('fs');

const { raccitFiles } = require('../utils');

const initCmd = () => {
  fs.mkdirSync('.raccit');
  fs.mkdirSync('.raccit/commits');
  fs.mkdirSync('.raccit/objects');
  raccitFiles.writeTo('HEAD.json', null);
  raccitFiles.writeTo('Index.json', {
    parent: null,
    body: ['./'],
  });
};
module.exports = initCmd;

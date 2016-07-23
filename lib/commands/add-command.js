const fs = require('fs');

const {
  addFileToIndex,
} = require('../utils');

/* files */
const fileExist = (filename) => {
  try {
    fs.statSync(filename);
    return true;
  } catch (e) {
    return false;
  }
};

// TODO: handle recursive folders
const addCmd = (filename) => {
  if (!filename) {
    console.log('Should specify filename'); // eslint-disable-line no-console
    process.exit(1);
  }
  if (fileExist(filename)) {
    addFileToIndex(filename);
    process.exit(0);
  } else {
    console.log('File does not exit. Exiting now'); // eslint-disable-line no-console
    process.exit(1);
  }
};

module.exports = addCmd;

const {
  addFileToIndex,
  fileExists,
} = require('../utils');

// TODO: handle recursive folders
const addCmd = (filename) => {
  if (!filename) {
    console.log('Should specify filename'); // eslint-disable-line no-console
    process.exit(1);
  }
  if (fileExists(filename)) {
    addFileToIndex(filename);
    process.exit(0);
  } else {
    console.log('File does not exit. Exiting now'); // eslint-disable-line no-console
    process.exit(1);
  }
};

module.exports = addCmd;

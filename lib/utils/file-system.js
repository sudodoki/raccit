const fs = require('fs');

const fileExists = (filename) => {
  try {
    fs.statSync(filename);
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = {
  fileExists,
};

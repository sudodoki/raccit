const fs = require('fs');

const fileExists = (filename) => {
  try {
    fs.statSync(filename);
    return true;
  } catch (e) {
    return false;
  }
};

const readFrom = (pathname) =>
  fs.readFileSync(pathname).toString();

const writeTo = (pathname, content) => {
  fs.writeFileSync(pathname, content);
};

module.exports = {
  fileExists,
  readFrom,
  writeTo,
};

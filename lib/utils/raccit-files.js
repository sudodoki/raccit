const fs = require('fs');
const path = require('path');

// TODO: support recursive search for raccit in parent folder
// TODO: throw exception if not found
const raccitPath = path.resolve(process.cwd(), '.raccit');

const pathInRaccit = (filePath) => path.resolve(raccitPath, filePath);

// assuming json
const readFrom = (pathname, { asJSON = true } = {}) => (
  asJSON
    ? require(pathInRaccit(pathname)) // eslint-disable-line global-require
    : fs.readFileSync(pathInRaccit(pathname)).toString());

// assuming json
const writeTo = (pathname, data, { asJSON = true } = {}) => {
  const dataToWrite = asJSON ? JSON.stringify(data, null, 2) : data;
  fs.writeFileSync(pathInRaccit(pathname), dataToWrite);
};

const exist = (pathname) => {
  try {
    fs.statSync(pathInRaccit(pathname));
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = {
  raccitFiles: {
    exist,
    readFrom,
    writeTo,
  },
};

const path = require('path');

const fileSystemUtils = require('../file-system');
// { fileExists, readFrom, writeTo }
// TODO: support recursive search for raccit in parent folder
// TODO: throw exception if not found
const raccitPath = path.resolve(process.cwd(), '.raccit');

const pathInRaccit = (filePath) => path.resolve(raccitPath, filePath);

// assuming json
const readFrom = (pathname, { asJSON = true } = {}) => {
  const content = fileSystemUtils.readFrom(pathInRaccit(pathname));
  return asJSON ? JSON.parse(content) : content;
};

// assuming json
const writeTo = (pathname, data, { asJSON = true } = {}) => {
  const dataToWrite = asJSON ? JSON.stringify(data, null, 2) : data;
  fileSystemUtils.writeTo(pathInRaccit(pathname), dataToWrite);
};

const exist = (pathname) => fileSystemUtils.fileExists(pathInRaccit(pathname));

module.exports = {
  raccitFiles: {
    exist,
    readFrom,
    writeTo,
  },
};

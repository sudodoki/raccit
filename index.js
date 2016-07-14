const run = require('./lib/commands');
// console.log(process.argv[2], process.argv[3], process.argv[4]);
const [_executable, _currentFile, operation, filename] = process.argv;
// status
const statusCmd = 'st';
const diffCMD = 'diff';
const snapshotCMD = '-s';
const historyCMD = '-h';
const addCMD = 'add';

if (operation === statusCmd) {
  run.status(filename);
}

if (operation === diffCMD) {
  // TODO: add recursive support
  run.diff(filename);
}

if (operation === snapshotCMD) {
  run.snapshot({ message: filename });
}

if (operation === historyCMD) {
  run.history();
}

if (operation === addCMD) {
  run.add(filename);
}

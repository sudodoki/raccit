const run = require('./lib/commands');
// console.log(process.argv[2], process.argv[3], process.argv[4]);
const [_executable, _currentFile, operation, ...args] = process.argv;
const statusCMD = 'st';
const diffCMD = 'diff';
const snapshotCMD = '-s';
const historyCMD = '-h';
const resetCMD = '-r';
const addCMD = 'add';
if (!operation) {
  console.log('Available Commands: ', [ // eslint-disable-line no-console
    statusCMD,
    diffCMD,
    snapshotCMD,
    historyCMD,
    resetCMD,
    addCMD,
  ]);
}
if (operation === statusCMD) {
  const filename = args[0];
  run.status(filename);
}

if (operation === diffCMD) {
  let [range, filename] = args;
  if (!filename) {
    filename = range;
    range = '';
  }
  run.diff(filename, range);
}

if (operation === snapshotCMD) {
  const message = args[0];
  run.snapshot({ message });
}

if (operation === historyCMD) {
  run.history();
}

if (operation === addCMD) {
  const filename = args[0];
  run.add(filename);
}

if (operation === resetCMD) {
  const mode = args[0];
  let ID = args[1];
  if (mode !== '--hard') {
    ID = mode;
  }
  run.reset(mode, ID);
}

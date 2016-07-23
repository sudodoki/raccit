const statusCmd = require('./status-command');
const diffCmd = require('./diff-command');
const snapshotCmd = require('./snapshot-command');
const historyCmd = require('./history-command');
const addCmd = require('./add-command');
const resetCmd = require('./reset-command');
const initCmd = require('./init-command');

module.exports = {
  add: addCmd,
  diff: diffCmd,
  history: historyCmd,
  init: initCmd,
  reset: resetCmd,
  snapshot: snapshotCmd,
  status: statusCmd,
};

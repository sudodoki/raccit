/* eslint-disable no-console */
module.exports = function print(operations, firstLine, secondLine) {
  let printRow1 = '';
  let printRow2 = '';
  let charTaken1 = 0;
  let charTaken2 = 0;
  for (let i = 0; i < operations.length; i ++) {
    if (operations[i].name === 'INSERTION') {
      printRow1 += '-';
      printRow2 += secondLine[charTaken2];
      charTaken2++;
    }
    if (operations[i].name === 'DELETION') {
      printRow1 += `${firstLine[charTaken1]}̶`;
      printRow2 += '-';
      charTaken1++;
    }
    if (operations[i].name === 'SWITCH') {
      printRow1 += `${firstLine[charTaken1]}⇄${firstLine[charTaken1 + 1]}`;
      printRow2 += `${secondLine[charTaken2]} ${secondLine[charTaken2 + 1]}`;
      charTaken1 += 2;
      charTaken2 += 2;
    }
    if (['CHANGE', 'KEEP'].includes(operations[i].name)) {
      printRow1 += firstLine[charTaken1];
      printRow2 += secondLine[charTaken2];
      charTaken1++;
      charTaken2++;
    }
  }
  console.log(printRow1);
  console.log(printRow2);
};

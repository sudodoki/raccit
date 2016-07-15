/*
const tree = [
  './',
  ['someFile.txt', 1],
  ['folder/', ['someFile2.txt', 10]],
];
bfs(tree, console.log.bind(console)); // eslint-disable-line no-console

./ null
./someFile.txt 1
./folder/ null
./folder/someFile2.txt 10
*/
const isLeaf = ([_whatever, ...children]) => Array.isArray(children) && !Array.isArray(children[0]);

// TODO: possible improvement - not search subtree that doesn't match prefix
function bfs(tree, fn) {
  let queue = [];
  queue.push(tree);
  let next = queue.shift();
  while (next) {
    const [path, ...children] = next;
    const data = isLeaf(next) ? children[0] : null;
    fn(path, data);
    if (!isLeaf(next)) {
      queue = queue.concat(children.map((item) => {
        const [pathSegment, ...childrenItems] = item;
        return [path + pathSegment, ...childrenItems];
      }));
    }
    next = queue.shift();
  }
}

const findSubtree = (tree, segment) => {
  const [_segment, ...branches] = tree;
  return branches.find(([branchSegment, ..._children]) => branchSegment === segment);
};

function getInTree(tree, path, createIfAbsent = false) {
  let currentNode = tree;
  // TODO: could be early exit
  for (const segment of path.slice(1, -1)) {
    if (createIfAbsent && !findSubtree(currentNode, `${segment}/`)) {
      currentNode.push([`${segment}/`]);
    }
    currentNode = findSubtree(currentNode, `${segment}/`) || null;
  }
  return currentNode;
}

function setInTree(tree, path, data) {
  const newTree = Array.from(tree);
  if (tree[0] !== path[0]) {
    throw new Error('./ not found in path - this is unacceptable');
  }
  const currentNode = getInTree(newTree, path.slice(0, -1), true);
  const finalSegment = path.slice(-1)[0];
  if (!currentNode.find(it => Array.isArray(it) && it[0] === finalSegment)) {
    currentNode.push([`${finalSegment}`, data]);
  } else {
    const nodeToModify = currentNode.find(it => Array.isArray(it) && it[0] === finalSegment);
    nodeToModify[1] = data;
  }
  return newTree;
}

// TODO: implement
function deleteInTree(tree, path) {
  throw new Error('not Yet implemented')
  const newTree = Array.from(tree);
  for (let lastIndex = path.length - 1; lastIndex > 0; lastIndex -= 1) {
    // console.log(path.slice(0, lastIndex))
    const toDelete = path.slice(lastIndex, lastIndex + 1)[0];
    const whereToDelete = path.slice(0, lastIndex);
    console.log('whereToDelete: ', whereToDelete, ' toDelete: ', toDelete);
    const subTreeToModify = getInTree(newTree, whereToDelete.concat('placeholder'));
    // const deleteAt = subTreeToModify.findIndex(i => Array.isArray(i) && i[0] === toDelete);
    console.log('subTreeToModify', subTreeToModify)
    // subTreeToModify.splice(deleteAt, 1);
  }
  console.log('deleteInTree result', tree, newTree);
  return newTree;
}

const getAllChildren = (tree) => {
  const leaves = [];
  bfs(tree, (path, data) => {
    if (data) leaves.push(path);
  });
  return leaves;
};

module.exports = {
  bfs,
  getInTree,
  setInTree,
};

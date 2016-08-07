// TRAVERSE.find ?
/*
{
  path: './',
  children: [
    { path: 'file.txt', content: '2ahash' },
    { path: 'someFolder',
      children: [
        { path: 'someFile', content: 'anotherhash'},
      ],
    },
  ],
}
*/
// const isLeaf = ([_whatever, ...children]) => Array.isArray(children) && !Array.isArray(children[0]);

// TODO: possible improvement - not search subtree that doesn't match prefix
function bfs(tree, fn) {
  let queue = [];
  queue.push(tree, []);
  let next = queue.shift();
  let currentPath = queue.shift();
  const childrenToQueueItems = (children, currentPathSegment, previousPath) =>
    children
      .map(item => [item, previousPath.concat(currentPathSegment)])
      .reduce((memo, tuple) => memo.concat(tuple), []);
  const strip = (object, property) => {
    const temp = Object.assign({}, object);
    delete temp[property];
    return temp;
  };
  while (next) {
    fn(strip(next, 'children'), currentPath);
    if (next.children) {
      queue = queue.concat(childrenToQueueItems(next.children, next.path, currentPath)
      );
    }
    next = queue.shift();
    currentPath = queue.shift();
  }
}

const pathEqual = segment => it => it.path === segment;

function findSubtree(tree, path) {
  let segment = path.shift();
  let next = tree;
  if (!pathEqual(segment)(tree)) { return null; }
  segment = path.shift();
  while (next && segment) {
    next = next.children.find(pathEqual(segment)) || null;
    segment = path.shift();
  }
  return next;
}

function createSubtree(rootNode, path) {
  if (!rootNode.children) {
    throw new Error('No children property found in tree passed');
  }
  let nextList = rootNode.children;
  let segment = path.shift();
  while (segment) {
    const needsCreation = !nextList.find(pathEqual(segment));
    if (needsCreation) {
      nextList.push({
        path: segment,
        children: [],
      });
    }
    nextList = nextList.find(pathEqual(segment)).children;
    segment = path.shift();
  }
}

function _getInTree(tree, path, createIfAbsent = false) { // eslint-disable-line no-underscore-dangle
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
  const currentNode = _getInTree(newTree, path.slice(0, -1), true);
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
function _deleteInTree(/* tree, path */) { // eslint-disable-line no-underscore-dangle
  throw new Error('not Yet implemented');
  // const newTree = Array.from(tree);
  // for (let lastIndex = path.length - 1; lastIndex > 0; lastIndex -= 1) {
  //   // console.log(path.slice(0, lastIndex))
  //   const toDelete = path.slice(lastIndex, lastIndex + 1)[0];
  //   const whereToDelete = path.slice(0, lastIndex);
  //   console.log('whereToDelete: ', whereToDelete, ' toDelete: ', toDelete);
  //   const subTreeToModify = getInTree(newTree, whereToDelete.concat('placeholder'));
  //   // const deleteAt = subTreeToModify.findIndex(i => Array.isArray(i) && i[0] === toDelete);
  //   console.log('subTreeToModify', subTreeToModify)
  //   // subTreeToModify.splice(deleteAt, 1);
  // }
  // console.log('deleteInTree result', tree, newTree);
  // return newTree;
}

// const getAllChildren = (tree) => {
//   const leaves = [];
//   bfs(tree, (path, data) => {
//     if (data) leaves.push(path);
//   });
//   return leaves;
// };

module.exports = {
  bfs,
  findSubtree,
  createSubtree,
  setInTree,
};

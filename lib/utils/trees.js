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
  const pathCopy = Array.from(path);
  let segment = pathCopy.shift();
  let next = tree;
  if (!pathEqual(segment)(tree)) { return null; }
  segment = pathCopy.shift();
  while (next && segment) {
    next = next.children.find(pathEqual(segment)) || null;
    segment = pathCopy.shift();
  }
  return next;
}

function createSubtree(rootNode, path) {
  const pathCopy = Array.from(path);
  if (!rootNode.children) {
    throw new Error('No children property found in tree passed');
  }
  let segment = pathCopy.shift();
  if (segment !== rootNode.path) { throw new Error('First item in path doesn\'t match rootNodes path'); }
  segment = pathCopy.shift();
  let nextList = rootNode.children;
  while (segment) {
    const needsCreation = !nextList.find(pathEqual(segment));
    if (needsCreation) {
      nextList.push({
        path: segment,
        children: [],
      });
    }
    nextList = nextList.find(pathEqual(segment)).children;
    segment = pathCopy.shift();
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

function setInTree(tree, path, content) {
  let existing = findSubtree(tree, path);

  if (!existing) {
    createSubtree(tree, path);
    existing = findSubtree(tree, path);
  }
  // should not let you set content if there are children;
  delete existing.children;
  existing.content = content;
  return tree;
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

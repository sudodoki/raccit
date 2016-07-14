/*
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

function setInTree(tree, path, data) {
  const newTree = Array.from(tree);
  let currentNode = newTree;
  if (currentNode[0] !== path[0]) {
    throw new Error('./ not found in path - this is unacceptable');
  }
  for (const segment of path.slice(1, -1)) {
    if (!findSubtree(currentNode, `${segment}/`)) {
      currentNode.push([`${segment}/`]);
    }
    currentNode = findSubtree(currentNode, `${segment}/`);
  }

  const finalSegment = path.slice(-1)[0];
  if (!currentNode.find(it => Array.isArray(it) && it[0] === finalSegment)) {
    currentNode.push([`${finalSegment}`, data]);
  } else {
    const nodeToModify = currentNode.find(it => Array.isArray(it) && it[0] === finalSegment);
    nodeToModify[1] = data;
  }
  return newTree;
}

// const tree = [
//   './',
//   ['someFile.txt', 1],
//   ['folder/', ['someFile2.txt', 10]],
// ];
// bfs(tree, console.log.bind(console)); // eslint-disable-line no-console


// function dfs([el, ...children], fn) {
//   throw 'Not implemented for new Data structure';
//   fn(el);
//   children.forEach((node) => dfs(node, fn));
// }

module.exports = {
  bfs,
  setInTree,
  // dfs,
};

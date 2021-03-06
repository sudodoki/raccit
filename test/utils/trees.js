/* eslint-disable no-unused-expressions */
/* eslint-env mocha */
const expect = require('chai').expect;
const sinon = require('sinon');
const trees = require('../../lib/utils/trees');
describe('utils/trees', () => {
  const rootNode = { path: './' };
  const node1 = {
    path: 'file.txt',
    content: '2ahash',
  };
  const node2 = {
    path: 'someFolder',
  };
  const node3 = {
    path: 'someFile',
    content: 'anotherhash',
  };
  let sampleTree;
  beforeEach(() => {
    sampleTree = Object.assign({}, rootNode, {
      children: [
        Object.assign({}, node1),
        Object.assign({}, node2, {
          children: [Object.assign({}, node3)],
        }),
      ],
    });
  });
  describe('#bfs', () => {
    it('should be defined', () => {
      expect(trees.bfs).to.be.ok;
    });
    it('should accept tree and function', () => {
      expect(trees.bfs.bind(null, sampleTree, () => {})).not.to.throw;
    });

    describe('when invoked with callback passed', () => {
      const fakeIterator = sinon.spy();
      afterEach(() => {
        fakeIterator.reset();
      });
      it('should be called for each node in tree', () => {
        trees.bfs(sampleTree, fakeIterator);
        expect(fakeIterator.callCount).to.equal(4);
      });
      it('each invokation should include node', () => {
        trees.bfs(sampleTree, fakeIterator);
        expect(fakeIterator.getCall(0).args[0]).to.eql(rootNode);
        expect(fakeIterator.getCall(1).args[0]).to.eql(node1);
        expect(fakeIterator.getCall(2).args[0]).to.eql(node2);
        expect(fakeIterator.getCall(3).args[0]).to.eql(node3);
      });
      it('each invokation should include path', () => {
        trees.bfs(sampleTree, fakeIterator);
        expect(fakeIterator.getCall(0).args[1]).to.eql([]);
        expect(fakeIterator.getCall(1).args[1]).to.eql([rootNode.path]);
        expect(fakeIterator.getCall(2).args[1]).to.eql([rootNode.path]);
        expect(fakeIterator.getCall(3).args[1]).to.eql([rootNode.path, node2.path]);
      });
    });

  });

  describe('#findSubtree', () => {
    it('should be defined', () => {
      expect(trees.findSubtree).to.be.ok;
    });
    it('should accept tree and path', () => {
      expect(trees.findSubtree.bind(null, sampleTree, [])).not.to.throw;
    });
    it('should return root node if requested', () => {
      const result = trees.findSubtree(sampleTree, [rootNode.path]);
      expect(result).to.eql(sampleTree);
    });

    it('should return matching node if present (shallow)', () => {
      const result = trees.findSubtree(sampleTree, [rootNode.path, node1.path]);
      expect(result).to.eql(node1);
    });
    it('should return matching node if present (nested)', () => {
      const result = trees.findSubtree(sampleTree, [rootNode.path, node2.path, node3.path]);
      expect(result).to.eql(node3);
    });
    it('should return matching subtree if present (nested)', () => {
      const result = trees.findSubtree(sampleTree, [rootNode.path, node2.path]);
      expect(result).to.eql(Object.assign({}, node2, {
        children: [Object.assign({}, node3)],
      }));
    });
    it('should return null for non-existent path (wrong from the start)', () => {
      const result = trees.findSubtree(sampleTree, [node2.path]);
      expect(result).to.equal(null);
    });
    it('should return null for non-existent path', () => {
      const result = trees.findSubtree(sampleTree, [rootNode.path, 'someOtherPath', 'etc']);
      expect(result).to.equal(null);
    });
    it('should return null for empty trees', () => {
      const result = trees.findSubtree({ path: './', children: [] }, [rootNode.path, node2.path]);
      expect(result).to.equal(null);
    });
  });

  describe('#createSubtree', () => {
    it('should be defined', () => {
      expect(trees.createSubtree).to.be.ok;
    });
    it('should accept tree and path', () => {
      expect(trees.createSubtree.bind(null, sampleTree, ['./', 'someNewFolder', 'someNewFile'])).not.to.throw;
    });
    it('should create nodes when path does not match existing', () => {
      trees.createSubtree(sampleTree, [rootNode.path, 'someNewFolder', 'someNewFile']);
      expect(sampleTree).to.eql(Object.assign({}, rootNode, {
        children: [
          Object.assign({}, node1),
          Object.assign({}, node2, {
            children: [Object.assign({}, node3)],
          }),
          {
            path: 'someNewFolder',
            children: [{
              path: 'someNewFile',
              children: [],
            }],
          },
        ],
      }));
    });
    it('should not create nodes when path matches existing', () => {
      trees.createSubtree(sampleTree, [rootNode.path, node2.path, node3.path]);
      expect(sampleTree).to.eql(sampleTree);
    });
  });

  describe('#setInTree', () => {
    it('should be defined', () => {
      expect(trees.setInTree).to.be.ok;
    });
    it('should accept tree, path and content', () => {
      expect(trees.setInTree.bind(null, sampleTree, [], 'something')).not.to.throw;
    });

    it('given existing path, should overwrite content', () => {
      trees.setInTree(sampleTree, [rootNode.path, node1.path], 'something');
      expect(sampleTree).to.eql(Object.assign({}, rootNode, {
        children: [
          Object.assign({}, {
            path: node1.path,
            content: 'something',
          }),
          Object.assign({}, node2, {
            children: [Object.assign({}, node3)],
          }),
        ],
      }));
    });

    it('given existing path with children, should remove children', () => {
      trees.setInTree(sampleTree, [rootNode.path, node2.path], 'something');
      expect(sampleTree).to.eql(Object.assign({}, rootNode, {
        children: [
          Object.assign({}, node1),
          Object.assign({}, {
            path: node2.path,
            content: 'something',
          }),
        ],
      }));
    });

    it('given non-existing path, will create it', () => {
      const result = trees.setInTree({ path: rootNode.path, children: [] }, [rootNode.path, 'someNewFile'], 'heythere');
      expect(result).to.eql({
        path: rootNode.path,
        children: [
          {
            path: 'someNewFile',
            content: 'heythere',
          },
        ],
      });
    });
  });


});

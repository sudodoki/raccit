/* eslint-disable no-unused-expressions */
/* eslint-env mocha */
const expect = require('chai').expect;
const fileSystem = require('../../lib/utils/file-system');
const mock = require('mock-fs');
const fs = require('fs');
const sinon = require('sinon');
describe('utils/file-system', () => {

  it('should be defined', () => {
    expect(fileSystem).to.be.ok;
  });

  describe('#fileExists', () => {
    beforeEach(() => {
      mock({
        '.raccit': {
          'INDEX.json': 'file content here',
          objects: {/** empty directory */},
        },
      });
    });
    afterEach(() => {
      mock.restore();
    });
    it('should be defined', () => {
      expect(fileSystem.fileExists).to.be.ok;
    });
    it('should accept path', () => {
      expect(fileSystem.fileExists.bind(null, 'somePath')).not.to.throw;
    });
    it('should return true for existing file', () => {
      expect(fileSystem.fileExists('.raccit/INDEX.json')).to.equal(true);
    });
    it('should return true for existing folder', () => {
      expect(fileSystem.fileExists('.raccit/objects')).to.equal(true);
    });
    it('should return false for non-existing entry', () => {
      expect(fileSystem.fileExists('curracit.raccit/objects')).to.equal(false);
    });
  });

  describe('#readFrom', () => {
    beforeEach(() => {
      mock({
        'INDEX.json': '{"parent": null, "body": { "path": "./" }}',
      });
    });
    afterEach(() => {
      mock.restore();
    });
    it('should be defined', () => {
      expect(fileSystem.readFrom).to.be.ok;
    });
    it('should accept path', () => {
      expect(fileSystem.readFrom.bind(null, 'somePath')).not.to.throw;
    });
    it('should return contents of specified file', () => {
      expect(fileSystem.readFrom('INDEX.json')).to.equal('{"parent": null, "body": { "path": "./" }}');
    });
  });
  describe('#writeTo', () => {
    beforeEach(() => {
      sinon.spy(fs, 'writeFileSync');
    });
    afterEach(() => {
      fs.writeFileSync.restore();
    });
    it('should be defined', () => {
      expect(fileSystem.writeTo).to.be.ok;
    });
    it('should accept path and data', () => {
      expect(fileSystem.writeTo.bind(null, 'somePath', 'somestring')).not.to.throw;
    });
    it('should invoke writeFileSync with corresponding data', () => {
      fileSystem.writeTo('somePath', 'someString');
      expect(fs.writeFileSync.calledOnce).to.be.ok;
    });
  });
});

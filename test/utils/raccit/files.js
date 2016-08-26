/* eslint-disable no-unused-expressions */
/* eslint-env mocha */
xdescribe('given no opts passed', () => {
  it('should treat file as JSON', () => {
    // const result = fileSystem.readFrom('./INDEX.json');
    // expect(result).to.eql({
    //   parent: null,
    //   body: {
    //     path: './',
    //   },
    // });
  });
});
xdescribe('given asJSON false opts passed', () => {
  it('should return file content', () => {
    // const result = fileSystem.readFrom('./INDEX.json', { asJSON: false });
    // expect(result).to.equal('{"parent": null, "body": { "path": "./" }}');
  });
});

xdescribe('#writeTo', () => {
  beforeEach(() => {
    // mock({
    //   'INDEX.json': '{"parent": null, "body": { "path": "./" }}',
    // });
  });
  afterEach(() => {
    // mock.restore();
  });
  // it('should be defined', () => {
  //   expect(fileSystem.writeTo).to.be.ok;
  // });
  // it('should accept path and opts', () => {
  //   expect(fileSystem.writeTo.bind(null, 'somePath', {})).not.to.throw;
  // });
  // describe('given no opts passed', () => {
  //   it('should treat file as JSON', () => {
  //     const result = fileSystem.writeTo('./INDEX.json');
  //     expect(result).to.eql({
  //       parent: null,
  //       body: {
  //         path: './',
  //       },
  //     });
  //   });
  // });
  // describe('given asJSON false opts passed', () => {
  //   it('should return file content', () => {
  //     const result = fileSystem.writeTo('./INDEX.json', { asJSON: false });
  //     expect(result).to.equal('{"parent": null, "body": { "path": "./" }}');
  //   });
  // });
});

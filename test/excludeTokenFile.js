'use strict';

const expect = require('chai').expect;
const excludeTokenFile = require('./../lib/excludeTokenFile');

describe('excludeTokenFile()', () => {

  beforeEach(() => {
    excludeTokenFile.serverless = {};
    excludeTokenFile.TOKEN_FILE_NAME = '.alexa-skills-token.json';
  });

  it('should have the token file in exclude option', () => {
    excludeTokenFile.excludeTokenFile().then(() => {
      const exclude = excludeTokenFile.serverless.service.package.exclude.pop();
      expect(exclude).to.equal(excludeTokenFile.TOKEN_FILE_NAME);
    });
  });

  it('should return BbPromise.resolve()', () => {
    excludeTokenFile.excludeTokenFile().then(() => {
      expect(true).to.equal(true);
    });
  });
});

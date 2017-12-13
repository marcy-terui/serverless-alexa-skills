'use strict';

const expect = require('chai').expect;
const diffModels = require('./../lib/diffModels');

describe('diffModels()', () => {

  beforeEach(() => {
    diffModels.serverless = { service: { custom: { alexa: { skills: [] }}}};
  });

  it('should return diff if it has the same ID', () => {
    let localSkills = [{
      id: 'foo',
      models: {
        'ja-JP': { foo: 'bar' }
      }
    }]
    let remoteSkills = [[{
      id: 'foo',
      local: 'ja-JP',
      model: { foo: 'buz' }
    }]]

    diffModels.serverless.service.custom.alexa.skills = localSkills;
    diffModels.diffModels(remoteSkills).then((ret) => {
      expect(ret.pop().length).to.equal(1);
    });
  });

  it('should not return diff if it has not the same ID', () => {
    let localSkills = [{
      id: 'foo',
      models: {
        'ja-JP': { foo: 'bar' }
      }
    }]
    let remoteSkills = [[{
      id: 'bar',
      local: 'ja-JP',
      model: { foo: 'buz' }
    }]]

    diffModels.serverless.service.custom.alexa.skills = localSkills;
    diffModels.diffModels(remoteSkills).then((ret) => {
      expect(ret.pop().length).to.equal(0);
    });
  });
});

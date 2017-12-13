'use strict';

const expect = require('chai').expect;
const diffSkills = require('./../lib/diffSkills');

describe('diffSkills()', () => {

  beforeEach(() => {
    diffSkills.serverless = { service: { custom: { alexa: { skills: [] }}}};
  });

  it('should return diff if it has the same ID', () => {
    let localSkills = [{
      id: 'foo',
      skillManifest: { foo: 'bar' }
    }]
    let remoteSkills = [{
      skillId: 'foo',
      skillManifest: { foo: 'buz' }
    }]

    diffSkills.serverless.service.custom.alexa.skills = localSkills;
    diffSkills.diffSkills(remoteSkills).then((ret) => {
      expect(ret.length).to.equal(1);
    });
  });

  it('should not return diff if it has not the same ID', () => {
    let localSkills = [{
      id: 'foo',
      skillManifest: { foo: 'bar' }
    }]
    let remoteSkills = [{
      skillId: 'bar',
      skillManifest: { foo: 'buz' }
    }]

    diffSkills.serverless.service.custom.alexa.skills = localSkills;
    diffSkills.diffSkills(remoteSkills).then((ret) => {
      expect(ret.length).to.equal(0);
    });
  });
});

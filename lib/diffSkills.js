'use strict';

const BbPromise = require('bluebird');
const { diff } = require('deep-diff');

module.exports = {
  diffSkills(remoteSkills) {
    return BbPromise.bind(this)
      .then(() => BbPromise.resolve(remoteSkills))
      .map(function (remote) {
        const localSkills = this.serverless.service.custom.alexa.skills;
        const local = localSkills.find(skill => skill.id === remote.skillId);
        let ret;
        if (!(typeof local === 'undefined')) {
          ret = {
            skillId: local.id,
            diff: diff(remote.manifest, local.manifest),
          };
        }
        return BbPromise.resolve(ret);
      })
      .then(ret => BbPromise.resolve(ret.filter(v => !(typeof v === 'undefined'))));
  },
};

'use strict';

const BbPromise = require('bluebird');
const AlexaApi = require('./AlexaApi');

module.exports = {
  updateSkills(diffs) {
    const alexaApi = new AlexaApi(this.getToken());
    return BbPromise.bind(this)
      .then(() => BbPromise.resolve(diffs))
      .mapSeries(function (diff) {
        if (diff.diff != null) {
          const localSkills = this.serverless.service.custom.alexa.skills;
          const local = localSkills.find(skill => skill.id === diff.skillId);
          return alexaApi.updateSkill(local.id, local.manifest);
        }
        return BbPromise.resolve();
      });
  },
};

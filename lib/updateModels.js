'use strict';

const BbPromise = require('bluebird');
const AlexaApi = require('./AlexaApi');

module.exports = {
  updateModels(diffs) {
    const alexaApi = new AlexaApi(this.getToken());
    return BbPromise.bind(this)
      .then(() => BbPromise.resolve(diffs))
      .mapSeries(function (diff) {
        return BbPromise.bind(this)
          .then(() => BbPromise.resolve(diff))
          .mapSeries(function (model) {
            const localSkills = this.serverless.service.custom.alexa.skills;
            const local = localSkills.find(skill => skill.id === model.skillId);
            if (
              !(typeof local.models[model.locale] === 'undefined')
              && !(typeof model.diff === 'undefined')
            ) {
              return alexaApi.updateModel(local.id, model.locale, local.models[model.locale]);
            }
            return BbPromise.resolve();
          });
      });
  },
};

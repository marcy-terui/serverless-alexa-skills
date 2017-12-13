'use strict';

const BbPromise = require('bluebird');
const { diff } = require('deep-diff');

module.exports = {
  diffModels(remoteModels) {
    return BbPromise.bind(this)
      .then(() => BbPromise.resolve(remoteModels))
      .map(function (remote) {
        return BbPromise.bind(this)
          .then(() => BbPromise.resolve(remote))
          .map(function (model) {
            const localSkills = this.serverless.service.custom.alexa.skills;
            const local = localSkills.find(skill => skill.id === model.id);
            let ret;
            if (!(typeof local === 'undefined')) {
              let localModel = null;
              if (model.locale in local.models) {
                localModel = local.models[model.locale];
              }
              ret = {
                skillId: local.id,
                locale: model.locale,
                diff: diff(model.model, localModel),
              };
            }
            return BbPromise.resolve(ret);
          })
          .then(ret => BbPromise.resolve(ret.filter(v => !(typeof v === 'undefined'))));
      });
  },
};

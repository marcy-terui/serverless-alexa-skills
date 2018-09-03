'use strict';

const BbPromise = require('bluebird');
const AlexaApi = require('./AlexaApi');

module.exports = {
  deleteSkill() {
    const alexaApi = new AlexaApi(this.getToken());
    return BbPromise.bind(this)
      .then(alexaApi.deleteSkill(this.options.id))
      .then(function () {
        this.serverless.cli.log('Deleted.');
        return BbPromise.resolve();
      });
  },
};

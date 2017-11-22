'use strict';

const BbPromise = require('bluebird');
const AlexaApi = require('./AlexaApi');
const getToken = require('./getToken');

module.exports = {
  deleteSkill() {
    const alexaApi = new AlexaApi(getToken(this.tokenFilePath));
    return BbPromise.bind(this)
      .then(alexaApi.deleteSkill(this.options.id))
      .then(function () {
        this.serverless.cli.log('Deleted.');
        return BbPromise.resolve();
      });
  },
};

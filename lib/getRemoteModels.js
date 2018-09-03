'use strict';

const AlexaApi = require('./AlexaApi');

module.exports = {
  getRemoteModels() {
    const alexaApi = new AlexaApi(this.getToken());
    return alexaApi.getModels(this.serverless.service.custom.alexa.vendorId);
  },
};

'use strict';

const AlexaApi = require('./AlexaApi');
const getToken = require('./getToken');

module.exports = {
  getRemoteModels() {
    const alexaApi = new AlexaApi(getToken(this.tokenFilePath));
    return alexaApi.getModels(this.serverless.service.custom.alexa.vendorId);
  },
};

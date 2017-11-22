'use strict';

const AlexaApi = require('./AlexaApi');
const getToken = require('./getToken');

module.exports = {
  getRemoteSkills() {
    const alexaApi = new AlexaApi(getToken(this.tokenFilePath));
    return alexaApi.getSkills(this.serverless.service.custom.alexa.vendorId);
  },
};

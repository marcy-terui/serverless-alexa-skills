'use strict';

const AlexaApi = require('./AlexaApi');

module.exports = {
  getRemoteSkills() {
    const alexaApi = new AlexaApi(this.getToken());
    return alexaApi.getSkills(this.serverless.service.custom.alexa.vendorId);
  },
};

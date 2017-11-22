'use strict';

const AlexaApi = require('./AlexaApi');
const getToken = require('./getToken');

module.exports = {
  createSkill() {
    const alexaApi = new AlexaApi(getToken(this.tokenFilePath));
    return alexaApi.createSkill(
      this.serverless.service.custom.alexa.vendorId,
      this.options.name,
      this.options.locale,
      this.options.type
    );
  },
};

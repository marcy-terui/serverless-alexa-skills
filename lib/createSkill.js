'use strict';

const AlexaApi = require('./AlexaApi');

module.exports = {
  createSkill() {
    const alexaApi = new AlexaApi(this.getToken());
    return alexaApi.createSkill(
      this.serverless.service.custom.alexa.vendorId,
      this.options.name,
      this.options.locale,
      this.options.type
    );
  },
};

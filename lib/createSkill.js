'use strict';

const AlexaApi = require('./AlexaApi');

module.exports = {
  createSkill() {
    const alexaApi = new AlexaApi(getToken(this.tokenFilePath));
    const options = this.options;
    return this.getVendorId().then(function (vendorId) {
      return alexaApi.createSkill(
        vendorId,
        options.name,
        options.locale,
        options.type
      );
    });
  },
};

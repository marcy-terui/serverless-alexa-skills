'use strict';

const AlexaApi = require('./AlexaApi');

module.exports = {
  getRemoteSkills() {
    const alexaApi = new AlexaApi(this.getToken(this.tokenFilePath));
    return this.getVendorId().then(function (vendorId) {
      return alexaApi.getSkills(vendorId);
    });
  },
};

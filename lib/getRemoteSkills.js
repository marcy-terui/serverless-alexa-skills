'use strict';

const AlexaApi = require('./AlexaApi');
const getToken = require('./getToken');

module.exports = {
  getRemoteSkills() {
    const alexaApi = new AlexaApi(getToken(this.tokenFilePath));
    return this.getVendorId().then(function (vendorId) {
      return alexaApi.getSkills(vendorId);
    });
  },
};

'use strict';

const fs = require('fs-extra');

module.exports = {
  getToken() {
    const accessToken = fs.readJsonSync(this.tokenFilePath);
    return this.oauth2.accessToken.create(accessToken.token);
  }
};

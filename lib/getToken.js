'use strict';

const fs = require('fs-extra');

module.exports = {
  getToken() {
    const accessToken = fs.readJsonSync(this.tokenFilePath);
    return accessToken.token.access_token;
  }
};

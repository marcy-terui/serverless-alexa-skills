'use strict';

const fs = require('fs-extra');

module.exports = {
  getToken() {
    if (!fs.pathExistsSync(this.tokenFilePath)) {
      throw new Error(`Unable to find token file at ${this.tokenFilePath}. You may need to re-run "alexa auth".`);
    }
    const accessToken = fs.readJsonSync(this.tokenFilePath);
    return this.oauth2.accessToken.create(accessToken.token);
  }
};

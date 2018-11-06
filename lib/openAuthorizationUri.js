'use strict';

const crypto = require('crypto');
const opn = require('opn');

module.exports = {
  openAuthorizationUri() {
    const options = this.options;
    const authorizationUri = this.oauth2.authorizationCode.authorizeURL({
      redirect_uri: `http://127.0.0.1:${this.localServerPort}/cb`,
      scope: 'alexa::ask:skills:readwrite alexa::ask:models:readwrite alexa::ask:skills:test',
      state: crypto.randomBytes(32).toString('hex'),
    });
    if (
      typeof options["no-localhost"] === 'undefined' ||
      !options["no-localhost"]
    ) {
      return opn(authorizationUri);
    }
    else {
      console.log("To authenticate with AWS just follow this link:", authorizationUri);
      return Promise.resolve();
    }
  }
};

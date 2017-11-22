'use strict';

const crypto = require('crypto');
const opn = require('opn');

module.exports = {
  openAuthorizationUri() {
    const authorizationUri = this.oauth2.authorizationCode.authorizeURL({
      redirect_uri: `http://localhost:${this.localServerPort}`,
      scope: 'alexa::ask:skills:readwrite alexa::ask:models:readwrite alexa::ask:skills:test',
      state: crypto.randomBytes(32).toString('hex'),
    });
    return opn(authorizationUri);
  },
};

'use strict';

const crypto = require('crypto');
const opn = require('opn');

module.exports = {
  openAuthorizationUri() {
    const authorizationUri = this.oauth2.authorizationCode.authorizeURL({
      redirect_uri: `http://127.0.0.1:${this.localServerPort}/cb`,
      scope: 'alexa::ask:skills:readwrite alexa::ask:models:readwrite alexa::ask:skills:test',
      state: crypto.randomBytes(32).toString('hex'),
    });
    return opn(authorizationUri);
  },
};

'use strict';

const path = require('path');
const so2 = require('simple-oauth2');
const homedir = require('os').homedir();

module.exports = {
  initialize() {
    this.localServerPort = this.serverless.service.custom.alexa.localServerPort || 3000;
    this.tokenFilePath = path.join(homedir, '.serverless', this.TOKEN_FILE_NAME);
    this.oauth2 = so2.create({
      client: {
        id: this.serverless.service.custom.alexa.clientId,
        secret: this.serverless.service.custom.alexa.clientSecret,
      },
      auth: {
        authorizeHost: 'https://www.amazon.com',
        authorizePath: '/ap/oa',
        tokenHost: 'https://api.amazon.com',
        tokenPath: '/auth/o2/token',
      },
    });
  },
};

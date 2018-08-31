'use strict';

const path = require('path');
const so2 = require('simple-oauth2');
const homedir = require('os').homedir();

module.exports = {
  initialize() {
    this.localServerPort = this.serverless.service.custom.alexa.localServerPort || 9090;
    this.tokenFilePath = path.join(homedir, '.serverless', this.TOKEN_FILE_NAME);
    this.oauth2 = so2.create({
      client: {
        id: this.serverless.service.custom.alexa.clientId || 'amzn1.application-oa2-client.aad322b5faab44b980c8f87f94fbac56',
        secret: this.serverless.service.custom.alexa.clientSecret || '1642d8869b829dda3311d6c6539f3ead55192e3fc767b9071c888e60ef151cf9',
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

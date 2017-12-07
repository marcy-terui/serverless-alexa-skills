'use strict';

const BbPromise = require('bluebird');

module.exports = {
  excludeTokenFile() {
    if (!this.serverless.service) {
      this.serverless.service = {};
    }
    if (!this.serverless.service.package) {
      this.serverless.service.package = {};
    }
    if (!this.serverless.service.package.exclude) {
      this.serverless.service.package.exclude = [];
    }
    this.serverless.service.package.exclude.push(this.TOKEN_FILE_NAME);
    return BbPromise.resolve();
  },
};

'use strict';

const BbPromise = require('bluebird');
const http = require('http');
const requestHandler = require('./requestHandler');

module.exports = {
  createHttpServer() {
    const server = http.createServer();
    server.tokenFilePath = this.tokenFilePath;
    server.oauth2 = this.oauth2;
    server.localServerPort = this.localServerPort;
    server.on('request', requestHandler);
    server.listen(this.localServerPort, '127.0.0.1');
    return BbPromise.resolve();
  },
};

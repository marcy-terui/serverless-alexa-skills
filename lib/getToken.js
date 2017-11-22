'use strict';

const fs = require('fs-extra');

module.exports = function (tokenFilePath) {
  const accessToken = fs.readJsonSync(tokenFilePath);
  return accessToken.token.access_token;
};

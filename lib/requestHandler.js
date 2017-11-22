'use strict';

const url = require('url');
const fs = require('fs-extra');

module.exports = function (req, res) {
  const { query } = url.parse(req.url, true);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  if ('code' in query) {
    this.oauth2.authorizationCode.getToken({
      code: query.code,
      redirect_uri: `http://localhost:${this.localServerPort}`,
    })
      .then((result) => {
        fs.outputJsonSync(this.tokenFilePath, this.oauth2.accessToken.create(result));
        res.end('Thank you for using Serverless Alexa Skills Plugin!!\n');
        process.exit(0);
      })
      .catch((error) => {
        res.end(error.error_description);
        throw error;
      });
  } else {
    res.end(`${query.error_description}\n`);
    throw new Error(query.error_description);
  }
};

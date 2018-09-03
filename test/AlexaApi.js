'use strict';

const expect = require('chai').expect;
const path = require('path');
const fs = require('fs-extra');
const AlexaApi = require('./../lib/AlexaApi');

describe('AlexaApi', () => {
  let alexaApi;

  beforeEach(() => {
    alexaApi = new AlexaApi({ expired: () => false, token: { access_token: 'token' } });
  });

  describe('#constructor()', () => {

    it('should have Authorization header', () => {
      return alexaApi.getHeaders().then(headers => expect(headers.Authorization).to.equal('token'));
    });

  });
});

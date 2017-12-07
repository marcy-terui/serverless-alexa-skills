'use strict';

const expect = require('chai').expect;
const path = require('path');
const fs = require('fs-extra');
const AlexaApi = require('./../lib/AlexaApi');

describe('AlexaApi', () => {
  let alexaApi;

  beforeEach(() => {
    alexaApi = new AlexaApi('token');
  });

  describe('#constructor()', () => {

    it('should have Authorization header', () => {
      expect(alexaApi.headers.Authorization).to.equal('token');
    });

  });
});

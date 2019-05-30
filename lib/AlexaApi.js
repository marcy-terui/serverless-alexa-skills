'use strict';

const BbPromise = require('bluebird');
const rp = require('request-promise');
const qs = require('querystring');
const so2 = require('simple-oauth2');

const URL_BASE = 'https://api.amazonalexa.com';
const URL_VERSION = 'v1';

class AlexaApi {
  constructor(token) {
    this.accessToken = token;
  }
  _getHeaders() {
    return {
      Authorization: this.accessToken.token.access_token,
    };
  }
  getHeaders() {
    if (this.accessToken.expired()) {
      return this.accessToken.refresh().then(newToken => {
        this.accessToken = newToken;
        return BbPromise.resolve(this._getHeaders())
      })
    }

    return BbPromise.resolve(this._getHeaders());
  }
  get(path, params) {
    let url = URL_BASE;

    if (path.startsWith(`/${URL_VERSION}`)) {
      url += path;
    } else {
      url = `${url}/${URL_VERSION}${path}`;
    }

    if (!(typeof params === 'undefined')) {
      url = `${url}?${qs.stringify(params)}`;
    }

    return this.getHeaders()
      .delay(200)
      .then(headers => rp({
        url,
        method: 'GET',
        headers,
      }));
  }
  _jsonRequest(url, method, params) {
    return this.getHeaders().then(headers => ({
      url,
      method,
      headers,
      json: true,
      body: params,
    }));
  }
  post(path, params) {
    const url = `${URL_BASE}/${URL_VERSION}${path}`;
    return this._jsonRequest(url, 'POST', params).then(rp);
  }
  put(path, params) {
    const url = `${URL_BASE}/${URL_VERSION}${path}`;
    return this._jsonRequest(url, 'PUT', params).then(rp);
  }
  delete(path) {
    const url = `${URL_BASE}/${URL_VERSION}${path}`;
    return this.getHeaders().then(headers => rp({
      url,
      method: 'DELETE',
      headers,
    }));
  }
  getVendors() {
    return this.get('/vendors').then(function (body) {
      const obj = JSON.parse(body);
      return BbPromise.resolve(obj.vendors);
    })
  }
  _getSkills(vendorId, nextToken = null) {
    const params = { vendorId };
    if (nextToken !== null) {
      params.nextToken = nextToken;
    }
    return this.get('/skills', params).then(function (body) {
      const obj = JSON.parse(body);
      const ret = obj.skills;
      if (body.nextToken != null) {
        ret.concat(this._getSkills(vendorId, body.nextToken));
      }
      return BbPromise.resolve(ret);
    });
  }
  getSkills(vendorId) {
    return BbPromise.bind(this)
      .then(function () {
        return BbPromise.resolve(this._getSkills(vendorId));
      })
      .mapSeries(function (skill) {
        return this.get(skill._links.self.href).then((body) => {
          const ret = JSON.parse(body);
          ret.skillId = skill.skillId;
          ret.stage = skill.stage;
          return BbPromise.resolve(ret);
        });
      });
  }
  getModels(vendorId) {
    return BbPromise.bind(this)
      .then(function () {
        return BbPromise.resolve(this.getSkills(vendorId));
      })
      .mapSeries(function (skill) {
        const skillLocales = skill.manifest.publishingInformation.locales;
        const locales = Object.keys(skillLocales).map(function (locale) {
          return { id: this.skillId, locale };
        }, skill);
        return BbPromise.bind(this)
          .then(() => BbPromise.resolve(locales))
          .mapSeries(function (locale) {
            return this.get(`/skills/${locale.id}/stages/development/interactionModel/locales/${locale.locale}`).then(body => BbPromise.resolve({
              id: locale.id,
              locale: locale.locale,
              model: JSON.parse(body),
            }))
              .catch((err) => {
                if (err.statusCode === 404) {
                  return BbPromise.resolve({
                    id: locale.id,
                    locale: locale.locale,
                    model: null,
                  });
                }
                return BbPromise.reject(err);
              });
          });
      });
  }
  createSkill(vendorId, name, locale, type) {
    return this.post('/skills', {
      vendorId,
      manifest: {
        publishingInformation: {
          locales: {
            [locale]: {
              name,
            },
          },
        },
        apis: {
          [type]: {},
        },
      },
    }).then(body => BbPromise.resolve(body.skillId));
  }
  updateSkill(skillId, manifest) {
    return this.put(`/skills/${skillId}/stages/development/manifest`, {
      manifest,
    }).then(() => BbPromise.resolve(skillId));
  }
  updateModel(skillId, locale, model) {
    return this.put(
      `/skills/${skillId}/stages/development/interactionModel/locales/${locale}`,
      model
    ).then(() => BbPromise.resolve({ id: skillId, locale }));
  }
  deleteSkill(id) {
    return this.delete(`/skills/${id}`);
  }
}

module.exports = AlexaApi;

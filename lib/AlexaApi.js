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

    return this.getHeaders().then(headers => rp({
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
      resolveWithFullResponse: true
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
      .map(function (skill) {
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
      .map(function (skill) {
        const skillLocales = skill.manifest.publishingInformation.locales;
        const locales = Object.keys(skillLocales).map(function (locale) {
          return { id: this.skillId, locale };
        }, skill);
        return BbPromise.bind(this)
          .then(() => BbPromise.resolve(locales))
          .map(function (locale) {
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
  getUpdateStatus(url) {
    return BbPromise
      .delay(1000)
      .then(() => this.get(url))
      .then(resp => JSON.parse(resp));
  }
  checkModelUpdateStatus(url, locale) {
    return this.getUpdateStatus(url)
      .then((resp) => {
        if (resp.interactionModel) {
          const status = resp.interactionModel[locale].lastUpdateRequest.status;

          if (status === 'IN_PROGRESS') {
            return this.checkModelUpdateStatus(url, locale);
          }

          if (status === 'FAILED') {
            const errors = resp.interactionModel.lastUpdateRequest.errors.map((error) => {
              return error.message;
            });

            throw new Error(errors.join('\n'));
          }
        }
      });
  }
  checkSkillUpdateStatus(url) {
    return this.getUpdateStatus(url)
      .then((resp) => {
        if (resp.manifest) {
          const status = resp.manifest.lastUpdateRequest.status;

          if (status === 'IN_PROGRESS') {
            return this.checkSkillUpdateStatus(url);
          }

          if (status === 'FAILED') {
            const errors = resp.manifest.lastUpdateRequest.errors.map((error) => {
              return error.message;
            });

            throw new Error(errors.join('\n'));
          }
        }
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
    })
    .tap(resp => this.checkSkillUpdateStatus(resp.headers.location))
    .then(resp => BbPromise.resolve(resp.body.skillId));
  }
  updateSkill(skillId, manifest) {
    return this.put(`/skills/${skillId}/stages/development/manifest`, {
      manifest,
    })
    .tap(resp => this.checkSkillUpdateStatus(resp.headers.location))
    .then(() => BbPromise.resolve(skillId));
  }
  updateModel(skillId, locale, model) {
    return this.put(`/skills/${skillId}/stages/development/interactionModel/locales/${locale}`, model)
      .tap(resp => this.checkModelUpdateStatus(resp.headers.location, locale))
      .then(() => BbPromise.resolve({ id: skillId, locale }));
  }
  deleteSkill(id) {
    return this.delete(`/skills/${id}`);
  }
}

module.exports = AlexaApi;

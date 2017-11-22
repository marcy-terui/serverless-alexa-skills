'use strict';

const BbPromise = require('bluebird');
const rp = require('request-promise');
const qs = require('querystring');

const URL_BASE = 'https://api.amazonalexa.com/v0';

class AlexaApi {
  constructor(token) {
    this.headers = {
      Authorization: token,
    };
  }
  get(path, params) {
    let url = URL_BASE + path;
    if (!(typeof params === 'undefined')) {
      url = `${url}?${qs.stringify(params)}`;
    }
    return rp({
      url,
      method: 'GET',
      headers: this.headers,
    });
  }
  _jsonRequest(url, method, params) {
    return {
      url,
      method,
      headers: this.headers,
      json: true,
      body: params,
    };
  }
  post(path, params) {
    const url = URL_BASE + path;
    return rp(this._jsonRequest(url, 'POST', params));
  }
  put(path, params) {
    const url = URL_BASE + path;
    return rp(this._jsonRequest(url, 'PUT', params));
  }
  delete(path) {
    const url = URL_BASE + path;
    return rp({
      url,
      method: 'DELETE',
      headers: this.headers,
    });
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
        const skillLocales = skill.skillManifest.publishingInformation.locales;
        const locales = Object.keys(skillLocales).map(function (locale) {
          return { id: this.skillId, locale };
        }, skill);
        return BbPromise.bind(this)
          .then(() => BbPromise.resolve(locales))
          .map(function (locale) {
            return this.get(`/skills/${locale.id}/interactionModel/locales/${locale.locale}`).then(body => BbPromise.resolve({
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
      skillManifest: {
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
  updateSkill(skillId, skillManifest) {
    return this.put(`/skills/${skillId}`, {
      skillManifest,
    }).then(() => BbPromise.resolve(skillId));
  }
  updateModel(skillId, locale, model) {
    return this.post(
      `/skills/${skillId}/interactionModel/locales/${locale}`,
      model
    ).then(() => BbPromise.resolve({ id: skillId, locale }));
  }
  deleteSkill(id) {
    return this.delete(`/skills/${id}`);
  }
}

module.exports = AlexaApi;

'use strict';

const BbPromise = require('bluebird');

const initialize = require('./lib/initialize');
const createHttpServer = require('./lib/createHttpServer');
const openAuthorizationUri = require('./lib/openAuthorizationUri');
const getRemoteSkills = require('./lib/getRemoteSkills');
const outputSkills = require('./lib/outputSkills');
const createSkill = require('./lib/createSkill');
const outputSkillId = require('./lib/outputSkillId');
const deleteSkill = require('./lib/deleteSkill');
const diffSkills = require('./lib/diffSkills');
const outputSkillsDiff = require('./lib/outputSkillsDiff');
const updateSkills = require('./lib/updateSkills');
const outputUpdatedSkillIds = require('./lib/outputUpdatedSkillIds');
const getRemoteModels = require('./lib/getRemoteModels');
const outputModels = require('./lib/outputModels');
const diffModels = require('./lib/diffModels');
const outputModelsDiff = require('./lib/outputModelsDiff');
const updateModels = require('./lib/updateModels');
const outputUpdatedModels = require('./lib/outputUpdatedModels');
const excludeTokenFile = require('./lib/excludeTokenFile');


class AlexaSkills {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};
    this.provider = this.serverless.getProvider('aws');
    this.TOKEN_FILE_NAME = '.alexa-skills-token.json';

    Object.assign(
      this,
      initialize,
      createHttpServer,
      openAuthorizationUri,
      getRemoteSkills,
      outputSkills,
      createSkill,
      outputSkillId,
      deleteSkill,
      diffSkills,
      outputSkillsDiff,
      updateSkills,
      outputUpdatedSkillIds,
      getRemoteModels,
      outputModels,
      diffModels,
      outputModelsDiff,
      updateModels,
      outputUpdatedModels,
      excludeTokenFile
    );

    this.commands = {
      alexa: {
        commands: {
          auth: {
            usage: 'Authenticate with Amazon OAuth2',
            lifecycleEvents: [
              'auth',
            ],
          },
          manifests: {
            usage: 'List your Alexa Skill Manifests',
            lifecycleEvents: [
              'list',
            ],
          },
          models: {
            usage: 'List your Alexa Interaction Models',
            lifecycleEvents: [
              'list',
            ],
          },
          create: {
            usage: 'Create an Alexa Skill',
            lifecycleEvents: [
              'create',
            ],
            options: {
              name: {
                usage: 'Name of the skill',
                shortcut: 'n',
                required: true,
              },
              locale: {
                usage: 'First locale of the skill (e.g. "ja-JP", "en-US")',
                shortcut: 'l',
                required: true,
              },
              type: {
                usage: 'Type of the skill (e.g. "custom", "smartHome", "video")',
                shortcut: 't',
                required: true,
              },
            },
          },
          delete: {
            usage: 'Delete an Alexa Skill',
            lifecycleEvents: [
              'delete',
            ],
            options: {
              id: {
                usage: 'Skill ID',
                shortcut: 'i',
                required: true,
              },
            },
          },
          update: {
            usage: 'Update your Alexa Skill Manifests',
            lifecycleEvents: [
              'update',
            ],
            options: {
              dryRun: {
                usage: 'Dry run (Only output the diff)',
                shortcut: 'd',
              },
            },
          },
          build: {
            usage: 'Update and buid your Alexa Interaction Models',
            lifecycleEvents: [
              'build',
            ],
            options: {
              dryRun: {
                usage: 'Dry run (Only output the diff)',
                shortcut: 'd',
              },
            },
          },
        },
      },
    };

    this.hooks = {
      'before:package:createDeploymentArtifacts': () => BbPromise.bind(this)
        .then(this.initialize)
        .then(this.excludeTokenFile),
      'alexa:auth:auth': () => BbPromise.bind(this)
        .then(this.initialize)
        .then(this.createHttpServer)
        .then(this.openAuthorizationUri),
      'alexa:manifests:list': () => BbPromise.bind(this)
        .then(this.initialize)
        .then(this.getRemoteSkills)
        .then(this.outputSkills),
      'alexa:models:list': () => BbPromise.bind(this)
        .then(this.initialize)
        .then(this.getRemoteModels)
        .then(this.outputModels),
      'alexa:create:create': () => BbPromise.bind(this)
        .then(this.initialize)
        .then(this.createSkill)
        .then(this.outputSkillId),
      'alexa:delete:delete': () => BbPromise.bind(this)
        .then(this.initialize)
        .then(this.deleteSkill),
      'alexa:update:update': () => BbPromise.bind(this)
        .then(this.initialize)
        .then(this.getRemoteSkills)
        .then(this.diffSkills)
        .then(this.outputSkillsDiff)
        .then(function (diffs) {
          if (!('dryRun' in this.options)) {
            return this.updateSkills(diffs);
          }
          return BbPromise.resolve();
        })
        .then(this.outputUpdatedSkillIds),
      'alexa:build:build': () => BbPromise.bind(this)
        .then(this.initialize)
        .then(this.getRemoteModels)
        .then(this.diffModels)
        .then(this.outputModelsDiff)
        .then(function (diffs) {
          if (!('dryRun' in this.options)) {
            return this.updateModels(diffs);
          }
          return BbPromise.resolve();
        })
        .then(this.outputUpdatedModels),
    };
  }
}

module.exports = AlexaSkills;

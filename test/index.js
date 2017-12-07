'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const Serverless = require('serverless/lib/Serverless');
const AwsProvider = require('serverless/lib/plugins/aws/provider/awsProvider');
const BbPromise = require('bluebird');
const AlexaSkills = require('./../index');

describe('AlexaSkills', () => {
  let serverless;
  let alexaSkills;

  beforeEach(() => {
    serverless = new Serverless();
    serverless.servicePath = true;
    serverless.init();
    serverless.setProvider('aws', new AwsProvider(serverless));
    alexaSkills = new AlexaSkills(serverless, {});
  });

  describe('#constructor()', () => {
    it('should have hooks', () => expect(alexaSkills.hooks).to.be.not.empty);

    it('should set the provider variable to an instance of AwsProvider', () =>
      expect(alexaSkills.provider).to.be.instanceof(AwsProvider));

      it('should run promise chain in order for before:package:createDeploymentArtifacts', () => {
        const initializeStub = sinon
          .stub(alexaSkills, 'initialize').returns(BbPromise.resolve());

        const excludeTokenFileStub = sinon
          .stub(alexaSkills, 'excludeTokenFile').returns(BbPromise.resolve());

        return alexaSkills.hooks['before:package:createDeploymentArtifacts']().then(() => {
          expect(initializeStub.calledOnce).to.equal(true);
          expect(excludeTokenFileStub.calledAfter(initializeStub))
            .to.equal(true);

          alexaSkills.initialize.restore();
          alexaSkills.excludeTokenFile.restore();
        });
      });

    it('should run promise chain in order for alexa:auth:auth', () => {
      const initializeStub = sinon
        .stub(alexaSkills, 'initialize').returns(BbPromise.resolve());

      const createHttpServerStub = sinon
        .stub(alexaSkills, 'createHttpServer').returns(BbPromise.resolve());

      const openAuthorizationUriStub = sinon
        .stub(alexaSkills, 'openAuthorizationUri').returns(BbPromise.resolve());

      return alexaSkills.hooks['alexa:auth:auth']().then(() => {
        expect(initializeStub.calledOnce).to.equal(true);
        expect(createHttpServerStub.calledAfter(initializeStub))
          .to.equal(true);
        expect(openAuthorizationUriStub.calledAfter(createHttpServerStub))
          .to.equal(true);

        alexaSkills.initialize.restore();
        alexaSkills.createHttpServer.restore();
        alexaSkills.openAuthorizationUri.restore();
      });
    });

    it('should run promise chain in order for alexa:manifests:list', () => {
      const initializeStub = sinon
        .stub(alexaSkills, 'initialize').returns(BbPromise.resolve());

      const getRemoteSkillsStub = sinon
        .stub(alexaSkills, 'getRemoteSkills').returns(BbPromise.resolve());

      const outputSkillsStub = sinon
        .stub(alexaSkills, 'outputSkills').returns(BbPromise.resolve());

      return alexaSkills.hooks['alexa:manifests:list']().then(() => {
        expect(initializeStub.calledOnce).to.equal(true);
        expect(getRemoteSkillsStub.calledAfter(initializeStub))
          .to.equal(true);
        expect(outputSkillsStub.calledAfter(getRemoteSkillsStub))
          .to.equal(true);

        alexaSkills.initialize.restore();
        alexaSkills.getRemoteSkills.restore();
        alexaSkills.outputSkills.restore();
      });
    });

    it('should run promise chain in order for alexa:models:list', () => {
      const initializeStub = sinon
        .stub(alexaSkills, 'initialize').returns(BbPromise.resolve());

      const getRemoteModelsStub = sinon
        .stub(alexaSkills, 'getRemoteModels').returns(BbPromise.resolve());

      const outputModelsStub = sinon
        .stub(alexaSkills, 'outputModels').returns(BbPromise.resolve());

      return alexaSkills.hooks['alexa:models:list']().then(() => {
        expect(initializeStub.calledOnce).to.equal(true);
        expect(getRemoteModelsStub.calledAfter(initializeStub))
          .to.equal(true);
        expect(outputModelsStub.calledAfter(getRemoteModelsStub))
          .to.equal(true);

        alexaSkills.initialize.restore();
        alexaSkills.getRemoteModels.restore();
        alexaSkills.outputModels.restore();
      });
    });

    it('should run promise chain in order for alexa:create:create', () => {
      const initializeStub = sinon
        .stub(alexaSkills, 'initialize').returns(BbPromise.resolve());

      const createSkillStub = sinon
        .stub(alexaSkills, 'createSkill').returns(BbPromise.resolve());

      const outputSkillIdStub = sinon
        .stub(alexaSkills, 'outputSkillId').returns(BbPromise.resolve());

      return alexaSkills.hooks['alexa:create:create']().then(() => {
        expect(initializeStub.calledOnce).to.equal(true);
        expect(createSkillStub.calledAfter(initializeStub))
          .to.equal(true);
        expect(outputSkillIdStub.calledAfter(createSkillStub))
          .to.equal(true);

        alexaSkills.initialize.restore();
        alexaSkills.createSkill.restore();
        alexaSkills.outputSkillId.restore();
      });
    });

    it('should run promise chain in order for alexa:delete:delete', () => {
      const initializeStub = sinon
        .stub(alexaSkills, 'initialize').returns(BbPromise.resolve());

      const deleteSkillStub = sinon
        .stub(alexaSkills, 'deleteSkill').returns(BbPromise.resolve());

      return alexaSkills.hooks['alexa:delete:delete']().then(() => {
        expect(initializeStub.calledOnce).to.equal(true);
        expect(deleteSkillStub.calledAfter(initializeStub))
          .to.equal(true);

        alexaSkills.initialize.restore();
        alexaSkills.deleteSkill.restore();
      });
    });

    it('should run promise chain in order for alexa:update:update', () => {

      const initializeStub = sinon
        .stub(alexaSkills, 'initialize').returns(BbPromise.resolve());

      const getRemoteSkillsStub = sinon
        .stub(alexaSkills, 'getRemoteSkills').returns(BbPromise.resolve());

      const diffSkillsStub = sinon
        .stub(alexaSkills, 'diffSkills').returns(BbPromise.resolve());

      const outputSkillsDiffStub = sinon
        .stub(alexaSkills, 'outputSkillsDiff').returns(BbPromise.resolve());

      const updateSkillsStub = sinon
        .stub(alexaSkills, 'updateSkills').returns(BbPromise.resolve());

      const outputUpdatedSkillIdsStub = sinon
        .stub(alexaSkills, 'outputUpdatedSkillIds').returns(BbPromise.resolve());

      return alexaSkills.hooks['alexa:update:update']().then(() => {
        expect(initializeStub.calledOnce).to.equal(true);
        expect(getRemoteSkillsStub.calledAfter(initializeStub))
          .to.equal(true);
        expect(diffSkillsStub.calledAfter(initializeStub))
          .to.equal(true);
        expect(outputSkillsDiffStub.calledAfter(diffSkillsStub))
          .to.equal(true);
        expect(updateSkillsStub.calledAfter(outputSkillsDiffStub))
          .to.equal(true);
        expect(outputUpdatedSkillIdsStub.calledAfter(updateSkillsStub))
          .to.equal(true);

        alexaSkills.initialize.restore();
        alexaSkills.getRemoteSkills.restore();
        alexaSkills.diffSkills.restore();
        alexaSkills.outputSkillsDiff.restore();
        alexaSkills.updateSkills.restore();
        alexaSkills.outputUpdatedSkillIds.restore();
      });
    });

    it('should run promise chain in order for alexa:update:update (Dry run)', () => {
      alexaSkills = new AlexaSkills(serverless, {dryRun: true});

      const initializeStub = sinon
        .stub(alexaSkills, 'initialize').returns(BbPromise.resolve());

      const getRemoteSkillsStub = sinon
        .stub(alexaSkills, 'getRemoteSkills').returns(BbPromise.resolve());

      const diffSkillsStub = sinon
        .stub(alexaSkills, 'diffSkills').returns(BbPromise.resolve());

      const outputSkillsDiffStub = sinon
        .stub(alexaSkills, 'outputSkillsDiff').returns(BbPromise.resolve());

      const outputUpdatedSkillIdsStub = sinon
        .stub(alexaSkills, 'outputUpdatedSkillIds').returns(BbPromise.resolve());

      return alexaSkills.hooks['alexa:update:update']().then(() => {
        expect(initializeStub.calledOnce).to.equal(true);
        expect(getRemoteSkillsStub.calledAfter(initializeStub))
          .to.equal(true);
        expect(diffSkillsStub.calledAfter(initializeStub))
          .to.equal(true);
        expect(outputSkillsDiffStub.calledAfter(diffSkillsStub))
          .to.equal(true);
        expect(outputUpdatedSkillIdsStub.calledAfter(outputSkillsDiffStub))
          .to.equal(true);

        alexaSkills.initialize.restore();
        alexaSkills.getRemoteSkills.restore();
        alexaSkills.diffSkills.restore();
        alexaSkills.outputSkillsDiff.restore();
        alexaSkills.outputUpdatedSkillIds.restore();
      });
    });

    it('should run promise chain in order for alexa:build:build', () => {

      const initializeStub = sinon
        .stub(alexaSkills, 'initialize').returns(BbPromise.resolve());

      const getRemoteModelsStub = sinon
        .stub(alexaSkills, 'getRemoteModels').returns(BbPromise.resolve());

      const diffModelsStub = sinon
        .stub(alexaSkills, 'diffModels').returns(BbPromise.resolve());

      const outputModelsDiffStub = sinon
        .stub(alexaSkills, 'outputModelsDiff').returns(BbPromise.resolve());

      const updateModelsStub = sinon
        .stub(alexaSkills, 'updateModels').returns(BbPromise.resolve());

      const outputUpdatedModelsStub = sinon
        .stub(alexaSkills, 'outputUpdatedModels').returns(BbPromise.resolve());

      return alexaSkills.hooks['alexa:build:build']().then(() => {
        expect(initializeStub.calledOnce).to.equal(true);
        expect(getRemoteModelsStub.calledAfter(initializeStub))
          .to.equal(true);
        expect(diffModelsStub.calledAfter(getRemoteModelsStub))
          .to.equal(true);
        expect(outputModelsDiffStub.calledAfter(diffModelsStub))
          .to.equal(true);
        expect(updateModelsStub.calledAfter(outputModelsDiffStub))
          .to.equal(true);
        expect(outputUpdatedModelsStub.calledAfter(updateModelsStub))
          .to.equal(true);

        alexaSkills.initialize.restore();
        alexaSkills.getRemoteModels.restore();
        alexaSkills.diffModels.restore();
        alexaSkills.outputModelsDiff.restore();
        alexaSkills.updateModels.restore();
        alexaSkills.outputUpdatedModels.restore();
      });
    });

    it('should run promise chain in order for alexa:build:build (Dry run)', () => {
      alexaSkills = new AlexaSkills(serverless, {dryRun: true});

      const initializeStub = sinon
        .stub(alexaSkills, 'initialize').returns(BbPromise.resolve());

      const getRemoteModelsStub = sinon
        .stub(alexaSkills, 'getRemoteModels').returns(BbPromise.resolve());

      const diffModelsStub = sinon
        .stub(alexaSkills, 'diffModels').returns(BbPromise.resolve());

      const outputModelsDiffStub = sinon
        .stub(alexaSkills, 'outputModelsDiff').returns(BbPromise.resolve());

      const outputUpdatedModelsStub = sinon
        .stub(alexaSkills, 'outputUpdatedModels').returns(BbPromise.resolve());

      return alexaSkills.hooks['alexa:build:build']().then(() => {
        expect(initializeStub.calledOnce).to.equal(true);
        expect(getRemoteModelsStub.calledAfter(initializeStub))
          .to.equal(true);
        expect(diffModelsStub.calledAfter(getRemoteModelsStub))
          .to.equal(true);
        expect(outputModelsDiffStub.calledAfter(diffModelsStub))
          .to.equal(true);
        expect(outputUpdatedModelsStub.calledAfter(outputModelsDiffStub))
          .to.equal(true);

        alexaSkills.initialize.restore();
        alexaSkills.getRemoteModels.restore();
        alexaSkills.diffModels.restore();
        alexaSkills.outputModelsDiff.restore();
        alexaSkills.outputUpdatedModels.restore();
      });
    });

  });
});

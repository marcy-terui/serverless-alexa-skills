'use strict';

module.exports = {
  outputSkillId(skillId) {
    this.serverless.cli.log(`[Skill ID] ${skillId}`);
  },
};

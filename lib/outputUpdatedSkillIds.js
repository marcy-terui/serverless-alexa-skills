'use strict';

module.exports = {
  outputUpdatedSkillIds(skillIds) {
    if (!(typeof skillIds === 'undefined')) {
      skillIds.forEach(function (id) {
        if (!(typeof id === 'undefined')) {
          this.serverless.cli.log(`"${id}" updated.`);
        }
      }, this);
    }
  },
};

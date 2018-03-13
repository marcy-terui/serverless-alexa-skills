'use strict';

const YAML = require('js-yaml');

module.exports = {
  outputSkills(skills) {
    skills.forEach(function (skill) {
      this.serverless.cli.log(`
----------------
[Skill ID] ${skill.skillId}
[Stage] ${skill.stage}
[Skill Manifest]
${YAML.dump({ manifest: skill.manifest })}
      `);
    }, this);
  },
};

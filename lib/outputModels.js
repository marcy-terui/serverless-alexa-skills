'use strict';

const YAML = require('js-yaml');

module.exports = {
  outputModels(models) {
    models.forEach(function (model) {
      model.forEach(function (m) {
        this.serverless.cli.log(`
-------------------
[Skill ID] ${m.id}
[Locale] ${m.locale}
[Interaction Model]
${YAML.dump(m.model)}`);
      }, this);
    }, this);
  },
};

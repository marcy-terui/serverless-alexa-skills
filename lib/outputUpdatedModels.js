'use strict';

module.exports = {
  outputUpdatedModels(models) {
    if (!(typeof models === 'undefined')) {
      models.forEach(function (model) {
        model.forEach(function (m) {
          if (!(typeof m === 'undefined')) {
            this.serverless.cli.log(`"${m.id} - ${m.locale}" updated.`);
          }
        }, this);
      }, this);
    }
  },
};

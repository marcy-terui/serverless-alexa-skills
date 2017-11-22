'use strict';

const BbPromise = require('bluebird');

module.exports = {
  outputModelsDiff(diffs) {
    diffs.forEach(function (locales) {
      locales.forEach(function (diff) {
        if (diff.diff == null) {
          this.serverless.cli.log(`---------->\n[No change] ${diff.skillId} - ${diff.locale}`);
        } else {
          let log = `---------->\n[Changed] ${diff.skillId} - ${diff.locale}`;
          diff.diff.forEach((d) => {
            let parh = '';
            if ('path' in d) {
              parh = d.path.join('.');
            }
            switch (d.kind) {
              case 'N':
                log = `${log}\n- [New] ${parh} = ${JSON.stringify(d.rhs)}`;
                break;
              case 'D':
                log = `${log}\n- [Delete] ${parh}`;
                break;
              case 'E':
                if (d.lhs) {
                  log = `${log}\n- [Update] ${parh} ${JSON.stringify(d.lhs)} -> ${JSON.stringify(d.rhs)}`;
                } else {
                  log = `${log}\n- [New] ${JSON.stringify(d.rhs)}`;
                }
                break;
              case 'A':
                switch (d.item.kind) {
                  case 'N':
                    log = `${log}\n- [New] ${parh}.${d.index} = ${JSON.stringify(d.item.rhs)}`;
                    break;
                  case 'D':
                    log = `${log}\n- [Delete] ${parh}.${d.index}`;
                    break;
                  case 'E':
                    log = `${log}\n- [Update] ${parh}.${d.index} ${JSON.stringify(d.item.lhs)} -> ${JSON.stringify(d.item.rhs)}`;
                    break;
                  default:
                    break;
                }
                break;
              default:
                break;
            }
          }, this);
          this.serverless.cli.log(log);
        }
      }, this);
    }, this);
    return BbPromise.resolve(diffs);
  },
};

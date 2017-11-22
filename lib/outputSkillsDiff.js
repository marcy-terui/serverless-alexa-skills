'use strict';

const BbPromise = require('bluebird');

module.exports = {
  outputSkillsDiff(diffs) {
    diffs.forEach(function (diff) {
      if (diff.diff == null) {
        this.serverless.cli.log(`---------->\n[No change] ${diff.skillId}`);
      } else {
        let log = `---------->\n[Changed] ${diff.skillId}`;
        diff.diff.forEach((d) => {
          switch (d.kind) {
            case 'N':
              log = `${log}\n- [New] ${d.path.join('.')} = ${JSON.stringify(d.rhs)}`;
              break;
            case 'D':
              log = `${log}\n- [Delete] ${d.path.join('.')}`;
              break;
            case 'E':
              log = `${log}\n- [Update] ${d.path.join('.')} ${JSON.stringify(d.lhs)} -> ${JSON.stringify(d.rhs)}`;
              break;
            case 'A':
              switch (d.item.kind) {
                case 'N':
                  log = `${log}\n- [New] ${d.path.join('.')}.${d.index} = ${JSON.stringify(d.item.rhs)}`;
                  break;
                case 'D':
                  log = `${log}\n- [Delete] ${d.path.join('.')}.${d.index}`;
                  break;
                case 'E':
                  log = `${log}\n- [Update] ${d.path.join('.')}.${d.index} ${JSON.stringify(d.item.lhs)} -> ${JSON.stringify(d.item.rhs)}`;
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
    return BbPromise.resolve(diffs);
  },
};

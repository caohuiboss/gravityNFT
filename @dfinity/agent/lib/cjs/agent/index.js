'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m)
      if (p !== 'default' && !exports.hasOwnProperty(p))
        __createBinding(exports, m, p);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getDefaultAgent = void 0;
__exportStar(require('./api'), exports);
__exportStar(require('./http'), exports);
__exportStar(require('./proxy'), exports);
function getDefaultAgent() {
  const agent =
    typeof window === 'undefined'
      ? typeof global === 'undefined'
        ? typeof self === 'undefined'
          ? undefined
          : self.ic.agent
        : global.ic.agent
      : window.ic.agent;
  if (!agent) {
    throw new Error('No Agent could be found.');
  }
  return agent;
}
exports.getDefaultAgent = getDefaultAgent;
//# sourceMappingURL=index.js.map

'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getManagementCanister = void 0;
const actor_1 = require('../actor');
const principal_1 = require('@dfinity/principal');
const management_idl_1 = __importDefault(require('./management_idl'));
/* tslint:enable */
/**
 * Create a management canister actor.
 * @param config
 */
function getManagementCanister(config) {
  function transform(methodName, args, callConfig) {
    const first = args[0];
    let effectiveCanisterId = principal_1.Principal.fromHex('');
    if (first && typeof first === 'object' && first.canister_id) {
      effectiveCanisterId = principal_1.Principal.from(first.canister_id);
    }
    return { effectiveCanisterId };
  }
  return actor_1.Actor.createActor(
    management_idl_1.default,
    Object.assign(
      Object.assign(Object.assign({}, config), {
        canisterId: principal_1.Principal.fromHex(''),
      }),
      {
        callTransform: transform,
        queryTransform: transform,
      },
    ),
  );
}
exports.getManagementCanister = getManagementCanister;
//# sourceMappingURL=management.js.map

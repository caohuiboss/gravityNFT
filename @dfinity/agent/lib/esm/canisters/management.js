import { Actor } from '../actor';
import { Principal } from '@dfinity/principal';
import managementCanisterIdl from './management_idl';
/* tslint:enable */
/**
 * Create a management canister actor.
 * @param config
 */
export function getManagementCanister(config) {
  function transform(methodName, args, callConfig) {
    const first = args[0];
    let effectiveCanisterId = Principal.fromHex('');
    if (first && typeof first === 'object' && first.canister_id) {
      effectiveCanisterId = Principal.from(first.canister_id);
    }
    return { effectiveCanisterId };
  }
  return Actor.createActor(
    managementCanisterIdl,
    Object.assign(
      Object.assign(Object.assign({}, config), {
        canisterId: Principal.fromHex(''),
      }),
      {
        callTransform: transform,
        queryTransform: transform,
      },
    ),
  );
}
//# sourceMappingURL=management.js.map

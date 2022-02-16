import { Actor } from '../actor';
import assetCanister from './asset_idl';
/* tslint:enable */
/**
 * Create a management canister actor.
 * @param config
 */
export function createAssetCanisterActor(config) {
  return Actor.createActor(assetCanister, config);
}
//# sourceMappingURL=asset.js.map

import { ActorMethod, ActorSubclass, CallConfig } from '../actor';
import { Principal } from '@dfinity/principal';
export interface CanisterSettings {
  controller: [] | [Principal];
  compute_allocation: [] | [bigint];
  memory_allocation: [] | [bigint];
  freezing_threshold: [] | [bigint];
}
export interface ManagementCanisterRecord {
  provisional_create_canister_with_cycles: ActorMethod<
    [
      {
        amount: [] | [number];
        settings: [] | [CanisterSettings];
      },
    ],
    {
      canister_id: Principal;
    }
  >;
  install_code: ActorMethod<
    [
      {
        mode:
          | {
              install: null;
            }
          | {
              reinstall: null;
            }
          | {
              upgrade: null;
            };
        canister_id: Principal;
        wasm_module: number[];
        arg: number[];
      },
    ],
    void
  >;
}
/**
 * Create a management canister actor.
 * @param config
 */
export declare function getManagementCanister(
  config: CallConfig,
): ActorSubclass<ManagementCanisterRecord>;

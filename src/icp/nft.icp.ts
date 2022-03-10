import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { StoicIdentity } from 'ic-stoic-identity';

import { idlFactory } from './nft.did';
export { idlFactory } from './nft.did';

const hostUrlEl = 'https://ic0.app';
const canisterIdstr = '4k2wq-cqaaa-aaaab-qac7q-cai';

export const canisterId = Principal.fromText(canisterIdstr);

export const actor = async () => {
  try {
    let identity = await StoicIdentity.connect();

    const actor = Actor.createActor(idlFactory, {
      agent: new HttpAgent({
        host: hostUrlEl,
        identity,
      }),
      canisterId,
    });
    return actor;
  } catch (error) {
    console.log(error);
  }
};

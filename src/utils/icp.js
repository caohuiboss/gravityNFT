// Similar to the sample project on dfx new:
//4k2wq-cqaaa-aaaab-qac7q-cai: get inc set
//qlfqk-fqaaa-aaaah-qakfq-cai: whoami
//6jnqp-3qaaa-aaaah-qcbpq-cai: ic-Rush

import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
//import { AuthClient } from '@dfinity/auth-client';//dfinity 官方钱包，难用。不用了
//引入stoic 钱包
import { StoicIdentity } from 'ic-stoic-identity';
import { message, Loading } from 'antd';
import fleekStorage from '@fleekhq/fleek-storage-js';
const hostUrlEl = 'https://ic0.app';
const canisterIdstr = '4k2wq-cqaaa-aaaab-qac7q-cai';

//定义容器地址 及 接口描述
const canisterId = Principal.fromText(canisterIdstr);

const idlFactory = ({ IDL }) =>
  IDL.Service({
    whoami: IDL.Func([], [IDL.Principal], ['query']),
    get: IDL.Func([], [IDL.Nat], ['query']),
    inc: IDL.Func([], [], []),
    set: IDL.Func([IDL.Nat], [], []),
    get_token_properties: IDL.Func(
      [IDL.Nat64],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
      ['query'],
    ),
    claim: IDL.Func([], [IDL.Nat64], []),
  });

let identity;

export const connectWallet = async () => {
  StoicIdentity.load()
    .then(async (identity) => {
      if (identity != false) {
        //ID is a already connected wallet!
        message.Info('ID is a already connected wallet!');
      } else {
        //No existing connection, lets make one!
        console.log('No existing connection, lets make one!');
        identity = await StoicIdentity.connect();
      }

      //Lets display the connected principal!
      console.log(identity, identity.getPrincipal().toText());
    })
    .catch((e) => {
      console.log(e);
    });
};

export const mint = async () => {
  if (!identity) {
    identity = await StoicIdentity.connect();
  }
  const actor = Actor.createActor(idlFactory, {
    agent: new HttpAgent({
      host: hostUrlEl,
      identity,
    }),
    canisterId,
  });
  const hide = message.loading('Minting...', 0);
  try {
    actor
      .mint()
      .then((principal) => {
        console.log('Return:', principal);
        hide();
        message.success('Mint SUCCESS');
      })
      .catch(() => {
        message.error('Mint FAILED');
      });
  } catch (e) {
    hide();
    console.log(e);
    message.error('Mint 失败');
  }
};

export const uploadedFile = async (fileData) => {
  await fleekStorage.upload({
    apiKey: 'q4VweULidjYuWLLaYTkBkA==',
    apiSecret: 'SAgcpgf2mVeGnrVOMrXiKySZJMWNcrseWOGv1a0Ghvo=',
    key: 'my-file-key' + '-' + 1,
    ContentType: 'image/png',
    data: fileData,
    httpUploadProgressCallback: (event) => {
      console.log(Math.round((event.loaded / event.total) * 100) + '% done');
    },
  });
};

export const getFile = async () => {
  const myFile = await fleekStorage.get({
    apiKey: 'q4VweULidjYuWLLaYTkBkA==',
    apiSecret: 'SAgcpgf2mVeGnrVOMrXiKySZJMWNcrseWOGv1a0Ghvo=',
    key: 'my-file-key' + '-' + 1,
    getOptions: ['data'],
  });
  console.log('myFile', myFile);
};

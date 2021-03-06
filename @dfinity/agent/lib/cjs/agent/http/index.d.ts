import { JsonObject } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import { Identity } from '../../auth';
import {
  Agent,
  QueryFields,
  QueryResponse,
  ReadStateOptions,
  ReadStateResponse,
  SubmitResponse,
} from '../api';
import { HttpAgentRequest, HttpAgentRequestTransformFn } from './types';
export * from './transforms';
export { Nonce, makeNonce } from './types';
export declare enum RequestStatusResponseStatus {
  Received = 'received',
  Processing = 'processing',
  Replied = 'replied',
  Rejected = 'rejected',
  Unknown = 'unknown',
  Done = 'done',
}
export interface HttpAgentOptions {
  source?: HttpAgent;
  fetch?: typeof fetch;
  host?: string;
  identity?: Identity | Promise<Identity>;
  credentials?: {
    name: string;
    password?: string;
  };
}
export declare class HttpAgent implements Agent {
  rootKey: ArrayBuffer;
  private readonly _pipeline;
  private readonly _identity;
  private readonly _fetch;
  private readonly _host;
  private readonly _credentials;
  private _rootKeyFetched;
  constructor(options?: HttpAgentOptions);
  addTransform(fn: HttpAgentRequestTransformFn, priority?: number): void;
  getPrincipal(): Promise<Principal>;
  call(
    canisterId: Principal | string,
    options: {
      methodName: string;
      arg: ArrayBuffer;
      effectiveCanisterId?: Principal | string;
    },
    identity?: Identity | Promise<Identity>,
  ): Promise<SubmitResponse>;
  query(
    canisterId: Principal | string,
    fields: QueryFields,
    identity?: Identity | Promise<Identity>,
  ): Promise<QueryResponse>;
  readState(
    canisterId: Principal | string,
    fields: ReadStateOptions,
    identity?: Identity | Promise<Identity>,
  ): Promise<ReadStateResponse>;
  status(): Promise<JsonObject>;
  fetchRootKey(): Promise<ArrayBuffer>;
  protected _transform(request: HttpAgentRequest): Promise<HttpAgentRequest>;
}

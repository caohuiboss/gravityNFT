import { Principal } from '@dfinity/principal';
import { AgentError } from '../../errors';
import { AnonymousIdentity } from '../../auth';
import * as cbor from '../../cbor';
import { requestIdOf } from '../../request_id';
import { fromHex } from '../../utils/buffer';
import { Expiry } from './transforms';
import { SubmitRequestType } from './types';
export * from './transforms';
export { makeNonce } from './types';
export var RequestStatusResponseStatus;
(function (RequestStatusResponseStatus) {
  RequestStatusResponseStatus['Received'] = 'received';
  RequestStatusResponseStatus['Processing'] = 'processing';
  RequestStatusResponseStatus['Replied'] = 'replied';
  RequestStatusResponseStatus['Rejected'] = 'rejected';
  RequestStatusResponseStatus['Unknown'] = 'unknown';
  RequestStatusResponseStatus['Done'] = 'done';
})(RequestStatusResponseStatus || (RequestStatusResponseStatus = {}));
// Default delta for ingress expiry is 5 minutes.
const DEFAULT_INGRESS_EXPIRY_DELTA_IN_MSECS = 5 * 60 * 1000;
// Root public key for the IC, encoded as hex
const IC_ROOT_KEY =
  '308182301d060d2b0601040182dc7c0503010201060c2b0601040182dc7c05030201036100814' +
  'c0e6ec71fab583b08bd81373c255c3c371b2e84863c98a4f1e08b74235d14fb5d9c0cd546d968' +
  '5f913a0c0b2cc5341583bf4b4392e467db96d65b9bb4cb717112f8472e0d5a4d14505ffd7484' +
  'b01291091c5f87b98883463f98091a0baaae';
// IC0 domain info
const IC0_DOMAIN = 'ic0.app';
const IC0_SUB_DOMAIN = '.ic0.app';
class HttpDefaultFetchError extends AgentError {
  constructor(message) {
    super(message);
    this.message = message;
  }
}
function getDefaultFetch() {
  let defaultFetch;
  if (typeof window !== 'undefined') {
    // Browser context
    if (window.fetch) {
      defaultFetch = window.fetch.bind(window);
    } else {
      throw new HttpDefaultFetchError(
        'Fetch implementation was not available. You appear to be in a browser context, but window.fetch was not present.',
      );
    }
  } else if (typeof global !== 'undefined') {
    // Node context
    if (global.fetch) {
      defaultFetch = global.fetch;
    } else {
      throw new HttpDefaultFetchError(
        'Fetch implementation was not available. You appear to be in a Node.js context, but global.fetch was not available.',
      );
    }
  } else if (typeof self !== 'undefined') {
    if (self.fetch) {
      defaultFetch = self.fetch;
    }
  }
  if (defaultFetch) {
    return defaultFetch;
  }
  throw new HttpDefaultFetchError(
    'Fetch implementation was not available. Please provide fetch to the HttpAgent constructor, or ensure it is available in the window or global context.',
  );
}
// A HTTP agent allows users to interact with a client of the internet computer
// using the available methods. It exposes an API that closely follows the
// public view of the internet computer, and is not intended to be exposed
// directly to the majority of users due to its low-level interface.
//
// There is a pipeline to apply transformations to the request before sending
// it to the client. This is to decouple signature, nonce generation and
// other computations so that this class can stay as simple as possible while
// allowing extensions.
export class HttpAgent {
  constructor(options = {}) {
    this.rootKey = fromHex(IC_ROOT_KEY);
    this._pipeline = [];
    this._rootKeyFetched = false;
    if (options.source) {
      if (!(options.source instanceof HttpAgent)) {
        throw new Error("An Agent's source can only be another HttpAgent");
      }
      this._pipeline = [...options.source._pipeline];
      this._identity = options.source._identity;
      this._fetch = options.source._fetch;
      this._host = options.source._host;
      this._credentials = options.source._credentials;
    } else {
      this._fetch = options.fetch || getDefaultFetch() || fetch.bind(global);
    }
    if (options.host !== undefined) {
      if (!options.host.match(/^[a-z]+:/) && typeof window !== 'undefined') {
        this._host = new URL(window.location.protocol + '//' + options.host);
      } else {
        this._host = new URL(options.host);
      }
    } else if (options.source !== undefined) {
      // Safe to ignore here.
      this._host = options.source._host;
    } else {
      const location =
        typeof window !== 'undefined' ? window.location : undefined;
      if (!location) {
        throw new Error('Must specify a host to connect to.');
      }
      this._host = new URL(location + '');
    }
    // Rewrite to avoid redirects
    if (this._host.hostname.endsWith(IC0_SUB_DOMAIN)) {
      this._host.hostname = IC0_DOMAIN;
    }
    if (options.credentials) {
      const { name, password } = options.credentials;
      this._credentials = `${name}${password ? ':' + password : ''}`;
    }
    this._identity = Promise.resolve(
      options.identity || new AnonymousIdentity(),
    );
  }
  addTransform(fn, priority = fn.priority || 0) {
    // Keep the pipeline sorted at all time, by priority.
    const i = this._pipeline.findIndex((x) => (x.priority || 0) < priority);
    this._pipeline.splice(
      i >= 0 ? i : this._pipeline.length,
      0,
      Object.assign(fn, { priority }),
    );
  }
  async getPrincipal() {
    return (await this._identity).getPrincipal();
  }
  async call(canisterId, options, identity) {
    const id = await (identity !== undefined
      ? await identity
      : await this._identity);
    const canister = Principal.from(canisterId);
    const ecid = options.effectiveCanisterId
      ? Principal.from(options.effectiveCanisterId)
      : canister;
    const sender = id.getPrincipal() || Principal.anonymous();
    const submit = {
      request_type: SubmitRequestType.Call,
      canister_id: canister,
      method_name: options.methodName,
      arg: options.arg,
      sender,
      ingress_expiry: new Expiry(DEFAULT_INGRESS_EXPIRY_DELTA_IN_MSECS),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let transformedRequest = await this._transform({
      request: {
        body: null,
        method: 'POST',
        headers: Object.assign(
          { 'Content-Type': 'application/cbor' },
          this._credentials
            ? { Authorization: 'Basic ' + btoa(this._credentials) }
            : {},
        ),
      },
      endpoint: 'call' /* Call */,
      body: submit,
    });
    // Apply transform for identity.
    transformedRequest = await id.transformRequest(transformedRequest);
    const body = cbor.encode(transformedRequest.body);
    // Run both in parallel. The fetch is quite expensive, so we have plenty of time to
    // calculate the requestId locally.
    const [response, requestId] = await Promise.all([
      this._fetch(
        '' + new URL(`/api/v2/canister/${ecid.toText()}/call`, this._host),
        Object.assign(Object.assign({}, transformedRequest.request), { body }),
      ),
      requestIdOf(submit),
    ]);
    if (!response.ok) {
      throw new Error(
        `Server returned an error:\n` +
          `  Code: ${response.status} (${response.statusText})\n` +
          `  Body: ${await response.text()}\n`,
      );
    }
    return {
      requestId,
      response: {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      },
    };
  }
  async query(canisterId, fields, identity) {
    const id = await (identity !== undefined
      ? await identity
      : await this._identity);
    const canister =
      typeof canisterId === 'string'
        ? Principal.fromText(canisterId)
        : canisterId;
    const sender =
      (id === null || id === void 0 ? void 0 : id.getPrincipal()) ||
      Principal.anonymous();
    const request = {
      request_type: 'query' /* Query */,
      canister_id: canister,
      method_name: fields.methodName,
      arg: fields.arg,
      sender,
      ingress_expiry: new Expiry(DEFAULT_INGRESS_EXPIRY_DELTA_IN_MSECS),
    };
    // TODO: remove this any. This can be a Signed or UnSigned request.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let transformedRequest = await this._transform({
      request: {
        method: 'POST',
        headers: Object.assign(
          { 'Content-Type': 'application/cbor' },
          this._credentials
            ? { Authorization: 'Basic ' + btoa(this._credentials) }
            : {},
        ),
      },
      endpoint: 'read' /* Query */,
      body: request,
    });
    // Apply transform for identity.
    transformedRequest = await id.transformRequest(transformedRequest);
    const body = cbor.encode(transformedRequest.body);
    const response = await this._fetch(
      '' + new URL(`/api/v2/canister/${canister.toText()}/query`, this._host),
      Object.assign(Object.assign({}, transformedRequest.request), { body }),
    );
    if (!response.ok) {
      throw new Error(
        `Server returned an error:\n` +
          `  Code: ${response.status} (${response.statusText})\n` +
          `  Body: ${await response.text()}\n`,
      );
    }
    return cbor.decode(await response.arrayBuffer());
  }
  async readState(canisterId, fields, identity) {
    const canister =
      typeof canisterId === 'string'
        ? Principal.fromText(canisterId)
        : canisterId;
    const id = await (identity !== undefined
      ? await identity
      : await this._identity);
    const sender =
      (id === null || id === void 0 ? void 0 : id.getPrincipal()) ||
      Principal.anonymous();
    // TODO: remove this any. This can be a Signed or UnSigned request.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let transformedRequest = await this._transform({
      request: {
        method: 'POST',
        headers: Object.assign(
          { 'Content-Type': 'application/cbor' },
          this._credentials
            ? { Authorization: 'Basic ' + btoa(this._credentials) }
            : {},
        ),
      },
      endpoint: 'read_state' /* ReadState */,
      body: {
        request_type: 'read_state' /* ReadState */,
        paths: fields.paths,
        sender,
        ingress_expiry: new Expiry(DEFAULT_INGRESS_EXPIRY_DELTA_IN_MSECS),
      },
    });
    // Apply transform for identity.
    transformedRequest = await id.transformRequest(transformedRequest);
    const body = cbor.encode(transformedRequest.body);
    const response = await this._fetch(
      '' + new URL(`/api/v2/canister/${canister}/read_state`, this._host),
      Object.assign(Object.assign({}, transformedRequest.request), { body }),
    );
    if (!response.ok) {
      throw new Error(
        `Server returned an error:\n` +
          `  Code: ${response.status} (${response.statusText})\n` +
          `  Body: ${await response.text()}\n`,
      );
    }
    return cbor.decode(await response.arrayBuffer());
  }
  async status() {
    const headers = this._credentials
      ? {
          Authorization: 'Basic ' + btoa(this._credentials),
        }
      : {};
    const response = await this._fetch(
      '' + new URL(`/api/v2/status`, this._host),
      { headers },
    );
    if (!response.ok) {
      throw new Error(
        `Server returned an error:\n` +
          `  Code: ${response.status} (${response.statusText})\n` +
          `  Body: ${await response.text()}\n`,
      );
    }
    return cbor.decode(await response.arrayBuffer());
  }
  async fetchRootKey() {
    if (!this._rootKeyFetched) {
      // Hex-encoded version of the replica root key
      this.rootKey = (await this.status()).root_key;
      this._rootKeyFetched = true;
    }
    return this.rootKey;
  }
  _transform(request) {
    let p = Promise.resolve(request);
    for (const fn of this._pipeline) {
      p = p.then((r) => fn(r).then((r2) => r2 || r));
    }
    return p;
  }
}
//# sourceMappingURL=index.js.map

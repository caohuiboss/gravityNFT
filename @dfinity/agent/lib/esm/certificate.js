import { getDefaultAgent } from './agent';
import * as cbor from './cbor';
import { AgentError } from './errors';
import { hash } from './request_id';
import { blsVerify } from './utils/bls';
import { concat, fromHex, toHex } from './utils/buffer';
/**
 * A certificate needs to be verified (using {@link Certificate.prototype.verify})
 * before it can be used.
 */
export class UnverifiedCertificateError extends AgentError {
  constructor() {
    super(`Cannot lookup unverified certificate. Call 'verify()' first.`);
  }
}
/**
 * Make a human readable string out of a hash tree.
 * @param tree
 */
export function hashTreeToString(tree) {
  const indent = (s) =>
    s
      .split('\n')
      .map((x) => '  ' + x)
      .join('\n');
  function labelToString(label) {
    const decoder = new TextDecoder(undefined, { fatal: true });
    try {
      return JSON.stringify(decoder.decode(label));
    } catch (e) {
      return `data(...${label.byteLength} bytes)`;
    }
  }
  switch (tree[0]) {
    case 0 /* Empty */:
      return '()';
    case 1 /* Fork */: {
      const left = hashTreeToString(tree[1]);
      const right = hashTreeToString(tree[2]);
      return `sub(\n left:\n${indent(left)}\n---\n right:\n${indent(right)}\n)`;
    }
    case 2 /* Labeled */: {
      const label = labelToString(tree[1]);
      const sub = hashTreeToString(tree[2]);
      return `label(\n label:\n${indent(label)}\n sub:\n${indent(sub)}\n)`;
    }
    case 3 /* Leaf */: {
      return `leaf(...${tree[1].byteLength} bytes)`;
    }
    case 4 /* Pruned */: {
      return `pruned(${toHex(new Uint8Array(tree[1]))}`;
    }
    default: {
      return `unknown(${JSON.stringify(tree[0])})`;
    }
  }
}
function isBufferEqual(a, b) {
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  const a8 = new Uint8Array(a);
  const b8 = new Uint8Array(b);
  for (let i = 0; i < a8.length; i++) {
    if (a8[i] !== b8[i]) {
      return false;
    }
  }
  return true;
}
export class Certificate {
  constructor(response, _agent = getDefaultAgent()) {
    this._agent = _agent;
    this.verified = false;
    this._rootKey = null;
    this.cert = cbor.decode(new Uint8Array(response.certificate));
  }
  lookup(path) {
    this.checkState();
    return lookup_path(path, this.cert.tree);
  }
  async verify() {
    const rootHash = await reconstruct(this.cert.tree);
    const derKey = await this._checkDelegation(this.cert.delegation);
    const sig = this.cert.signature;
    const key = extractDER(derKey);
    const msg = concat(domain_sep('ic-state-root'), rootHash);
    const res = await blsVerify(
      new Uint8Array(key),
      new Uint8Array(sig),
      new Uint8Array(msg),
    );
    this.verified = res;
    return res;
  }
  checkState() {
    if (!this.verified) {
      throw new UnverifiedCertificateError();
    }
  }
  async _checkDelegation(d) {
    if (!d) {
      if (!this._rootKey) {
        if (this._agent.rootKey) {
          this._rootKey = this._agent.rootKey;
          return this._rootKey;
        }
        throw new Error(
          `Agent does not have a rootKey. Do you need to call 'fetchRootKey'?`,
        );
      }
      return this._rootKey;
    }
    const cert = new Certificate(d, this._agent);
    if (!(await cert.verify())) {
      throw new Error('fail to verify delegation certificate');
    }
    const lookup = cert.lookup(['subnet', d.subnet_id, 'public_key']);
    if (!lookup) {
      throw new Error(
        `Could not find subnet key for subnet 0x${toHex(d.subnet_id)}`,
      );
    }
    return lookup;
  }
}
const DER_PREFIX = fromHex(
  '308182301d060d2b0601040182dc7c0503010201060c2b0601040182dc7c05030201036100',
);
const KEY_LENGTH = 96;
function extractDER(buf) {
  const expectedLength = DER_PREFIX.byteLength + KEY_LENGTH;
  if (buf.byteLength !== expectedLength) {
    throw new TypeError(
      `BLS DER-encoded public key must be ${expectedLength} bytes long`,
    );
  }
  const prefix = buf.slice(0, DER_PREFIX.byteLength);
  if (!isBufferEqual(prefix, DER_PREFIX)) {
    throw new TypeError(
      `BLS DER-encoded public key is invalid. Expect the following prefix: ${DER_PREFIX}, but get ${prefix}`,
    );
  }
  return buf.slice(DER_PREFIX.byteLength);
}
/**
 * @param t
 */
export async function reconstruct(t) {
  switch (t[0]) {
    case 0 /* Empty */:
      return hash(domain_sep('ic-hashtree-empty'));
    case 4 /* Pruned */:
      return t[1];
    case 3 /* Leaf */:
      return hash(concat(domain_sep('ic-hashtree-leaf'), t[1]));
    case 2 /* Labeled */:
      return hash(
        concat(
          domain_sep('ic-hashtree-labeled'),
          t[1],
          await reconstruct(t[2]),
        ),
      );
    case 1 /* Fork */:
      return hash(
        concat(
          domain_sep('ic-hashtree-fork'),
          await reconstruct(t[1]),
          await reconstruct(t[2]),
        ),
      );
    default:
      throw new Error('unreachable');
  }
}
function domain_sep(s) {
  const len = new Uint8Array([s.length]);
  const str = new TextEncoder().encode(s);
  return concat(len, str);
}
/**
 * @param path
 * @param tree
 */
export function lookup_path(path, tree) {
  if (path.length === 0) {
    switch (tree[0]) {
      case 3 /* Leaf */: {
        return new Uint8Array(tree[1]).buffer;
      }
      default: {
        return undefined;
      }
    }
  }
  const label =
    typeof path[0] === 'string' ? new TextEncoder().encode(path[0]) : path[0];
  const t = find_label(label, flatten_forks(tree));
  if (t) {
    return lookup_path(path.slice(1), t);
  }
}
function flatten_forks(t) {
  switch (t[0]) {
    case 0 /* Empty */:
      return [];
    case 1 /* Fork */:
      return flatten_forks(t[1]).concat(flatten_forks(t[2]));
    default:
      return [t];
  }
}
function find_label(l, trees) {
  if (trees.length === 0) {
    return undefined;
  }
  for (const t of trees) {
    if (t[0] === 2 /* Labeled */) {
      const p = t[1];
      if (isBufferEqual(l, p)) {
        return t[2];
      }
    }
  }
}
//# sourceMappingURL=certificate.js.map

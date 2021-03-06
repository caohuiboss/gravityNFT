import { Agent, ReadStateResponse } from './agent';
import { AgentError } from './errors';
/**
 * A certificate needs to be verified (using {@link Certificate.prototype.verify})
 * before it can be used.
 */
export declare class UnverifiedCertificateError extends AgentError {
  constructor();
}
declare const enum NodeId {
  Empty = 0,
  Fork = 1,
  Labeled = 2,
  Leaf = 3,
  Pruned = 4,
}
export declare type HashTree =
  | [NodeId.Empty]
  | [NodeId.Fork, HashTree, HashTree]
  | [NodeId.Labeled, ArrayBuffer, HashTree]
  | [NodeId.Leaf, ArrayBuffer]
  | [NodeId.Pruned, ArrayBuffer];
/**
 * Make a human readable string out of a hash tree.
 * @param tree
 */
export declare function hashTreeToString(tree: HashTree): string;
export declare class Certificate {
  private _agent;
  private readonly cert;
  private verified;
  private _rootKey;
  constructor(response: ReadStateResponse, _agent?: Agent);
  lookup(path: Array<ArrayBuffer | string>): ArrayBuffer | undefined;
  verify(): Promise<boolean>;
  protected checkState(): void;
  private _checkDelegation;
}
/**
 * @param t
 */
export declare function reconstruct(t: HashTree): Promise<ArrayBuffer>;
/**
 * @param path
 * @param tree
 */
export declare function lookup_path(
  path: Array<ArrayBuffer | string>,
  tree: HashTree,
): ArrayBuffer | undefined;
export {};

'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Actor =
  exports.CanisterInstallMode =
  exports.UpdateCallRejectedError =
  exports.QueryCallRejectedError =
  exports.ActorCallError =
    void 0;
const buffer_1 = require('buffer/');
const agent_1 = require('./agent');
const management_1 = require('./canisters/management');
const errors_1 = require('./errors');
const candid_1 = require('@dfinity/candid');
const polling_1 = require('./polling');
const principal_1 = require('@dfinity/principal');
const buffer_2 = require('./utils/buffer');
class ActorCallError extends errors_1.AgentError {
  constructor(canisterId, methodName, type, props) {
    super(
      [
        `Call failed:`,
        `  Canister: ${canisterId.toText()}`,
        `  Method: ${methodName} (${type})`,
        ...Object.getOwnPropertyNames(props).map(
          (n) => `  "${n}": ${JSON.stringify(props[n])}`,
        ),
      ].join('\n'),
    );
    this.canisterId = canisterId;
    this.methodName = methodName;
    this.type = type;
    this.props = props;
  }
}
exports.ActorCallError = ActorCallError;
class QueryCallRejectedError extends ActorCallError {
  constructor(canisterId, methodName, result) {
    var _a;
    super(canisterId, methodName, 'query', {
      Status: result.status,
      Code:
        (_a = agent_1.ReplicaRejectCode[result.reject_code]) !== null &&
        _a !== void 0
          ? _a
          : `Unknown Code "${result.reject_code}"`,
      Message: result.reject_message,
    });
    this.result = result;
  }
}
exports.QueryCallRejectedError = QueryCallRejectedError;
class UpdateCallRejectedError extends ActorCallError {
  constructor(canisterId, methodName, requestId, response) {
    super(canisterId, methodName, 'update', {
      'Request ID': buffer_2.toHex(requestId),
      'HTTP status code': response.status.toString(),
      'HTTP status text': response.statusText,
    });
    this.requestId = requestId;
    this.response = response;
  }
}
exports.UpdateCallRejectedError = UpdateCallRejectedError;
/**
 * The mode used when installing a canister.
 */
var CanisterInstallMode;
(function (CanisterInstallMode) {
  CanisterInstallMode['Install'] = 'install';
  CanisterInstallMode['Reinstall'] = 'reinstall';
  CanisterInstallMode['Upgrade'] = 'upgrade';
})(
  (CanisterInstallMode =
    exports.CanisterInstallMode || (exports.CanisterInstallMode = {})),
);
const metadataSymbol = Symbol.for('ic-agent-metadata');
/**
 * An actor base class. An actor is an object containing only functions that will
 * return a promise. These functions are derived from the IDL definition.
 */
class Actor {
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return principal_1.Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static async install(fields, config) {
    const mode =
      fields.mode === undefined ? CanisterInstallMode.Install : fields.mode;
    // Need to transform the arg into a number array.
    const arg = fields.arg ? [...new Uint8Array(fields.arg)] : [];
    // Same for module.
    const wasmModule = [...new Uint8Array(fields.module)];
    const canisterId =
      typeof config.canisterId === 'string'
        ? principal_1.Principal.fromText(config.canisterId)
        : config.canisterId;
    await management_1.getManagementCanister(config).install_code({
      mode: { [mode]: null },
      arg,
      wasm_module: wasmModule,
      canister_id: canisterId,
    });
  }
  static async createCanister(config) {
    const { canister_id: canisterId } = await management_1
      .getManagementCanister(config || {})
      .provisional_create_canister_with_cycles({ amount: [], settings: [] });
    return canisterId;
  }
  static async createAndInstallCanister(interfaceFactory, fields, config) {
    const canisterId = await this.createCanister(config);
    await this.install(
      Object.assign({}, fields),
      Object.assign(Object.assign({}, config), { canisterId }),
    );
    return this.createActor(
      interfaceFactory,
      Object.assign(Object.assign({}, config), { canisterId }),
    );
  }
  static createActorClass(interfaceFactory) {
    const service = interfaceFactory({ IDL: candid_1.IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        const canisterId =
          typeof config.canisterId === 'string'
            ? principal_1.Principal.fromText(config.canisterId)
            : config.canisterId;
        super({
          config: Object.assign(
            Object.assign(Object.assign({}, DEFAULT_ACTOR_CONFIG), config),
            { canisterId },
          ),
          service,
        });
        for (const [methodName, func] of service._fields) {
          this[methodName] = _createActorMethod(this, methodName, func);
        }
      }
    }
    return CanisterActor;
  }
  static createActor(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
}
exports.Actor = Actor;
// IDL functions can have multiple return values, so decoding always
// produces an array. Ensure that functions with single or zero return
// values behave as expected.
function decodeReturnValue(types, msg) {
  const returnValues = candid_1.IDL.decode(types, buffer_1.Buffer.from(msg));
  switch (returnValues.length) {
    case 0:
      return undefined;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingStrategyFactory: polling_1.strategy.defaultStrategy,
};
function _createActorMethod(actor, methodName, func) {
  let caller;
  if (func.annotations.includes('query')) {
    caller = async (options, ...args) => {
      var _a, _b;
      // First, if there's a config transformation, call it.
      options = Object.assign(
        Object.assign({}, options),
        (_b = (_a = actor[metadataSymbol].config).queryTransform) === null ||
          _b === void 0
          ? void 0
          : _b.call(
              _a,
              methodName,
              args,
              Object.assign(
                Object.assign({}, actor[metadataSymbol].config),
                options,
              ),
            ),
      );
      const agent =
        options.agent ||
        actor[metadataSymbol].config.agent ||
        agent_1.getDefaultAgent();
      const cid = principal_1.Principal.from(
        options.canisterId || actor[metadataSymbol].config.canisterId,
      );
      const arg = candid_1.IDL.encode(func.argTypes, args);
      const result = await agent.query(cid, { methodName, arg });
      switch (result.status) {
        case 'rejected' /* Rejected */:
          throw new QueryCallRejectedError(cid, methodName, result);
        case 'replied' /* Replied */:
          return decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a, _b;
      // First, if there's a config transformation, call it.
      options = Object.assign(
        Object.assign({}, options),
        (_b = (_a = actor[metadataSymbol].config).callTransform) === null ||
          _b === void 0
          ? void 0
          : _b.call(
              _a,
              methodName,
              args,
              Object.assign(
                Object.assign({}, actor[metadataSymbol].config),
                options,
              ),
            ),
      );
      const agent =
        options.agent ||
        actor[metadataSymbol].config.agent ||
        agent_1.getDefaultAgent();
      const { canisterId, effectiveCanisterId, pollingStrategyFactory } =
        Object.assign(
          Object.assign(
            Object.assign({}, DEFAULT_ACTOR_CONFIG),
            actor[metadataSymbol].config,
          ),
          options,
        );
      const cid = principal_1.Principal.from(canisterId);
      const ecid =
        effectiveCanisterId !== undefined
          ? principal_1.Principal.from(effectiveCanisterId)
          : cid;
      const arg = candid_1.IDL.encode(func.argTypes, args);
      const { requestId, response } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
      });
      if (!response.ok) {
        throw new UpdateCallRejectedError(cid, methodName, requestId, response);
      }
      const pollStrategy = pollingStrategyFactory();
      const responseBytes = await polling_1.pollForResponse(
        agent,
        ecid,
        requestId,
        pollStrategy,
      );
      if (responseBytes !== undefined) {
        return decodeReturnValue(func.retTypes, responseBytes);
      } else if (func.retTypes.length === 0) {
        return undefined;
      } else {
        throw new Error(
          `Call was returned undefined, but type [${func.retTypes.join(',')}].`,
        );
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions =
    (options) =>
    (...args) =>
      caller(options, ...args);
  return handler;
}
//# sourceMappingURL=actor.js.map

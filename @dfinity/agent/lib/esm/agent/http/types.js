// tslint:enable:camel-case
// The types of values allowed in the `request_type` field for submit requests.
export var SubmitRequestType;
(function (SubmitRequestType) {
  SubmitRequestType['Call'] = 'call';
})(SubmitRequestType || (SubmitRequestType = {}));
/**
 * Create a random Nonce, based on date and a random suffix.
 */
export function makeNonce() {
  // Encode 128 bits.
  const buffer = new ArrayBuffer(16);
  const view = new DataView(buffer);
  const value =
    BigInt(+Date.now()) * BigInt(100000) +
    BigInt(Math.floor(Math.random() * 100000));
  view.setBigUint64(0, value);
  // tslint:disable-next-line:no-bitwise
  view.setBigUint64(1, value >> BigInt(64));
  return buffer;
}
//# sourceMappingURL=types.js.map

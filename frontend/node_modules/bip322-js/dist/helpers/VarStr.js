"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import dependency
const VarInt_1 = __importDefault(require("./VarInt"));
/**
 * Class that implement variable length string (VarStr) in Javascript.
 * Reference: https://en.bitcoin.it/wiki/Protocol_documentation#Variable_length_string
 */
class VarStr {
    /**
     * Encode a string buffer as a variable length string.
     * Reference: https://github.com/buidl-bitcoin/buidl-python/blob/d79e9808e8ca60975d315be41293cb40d968626d/buidl/helper.py#L203
     * @param s String buffer to be encoded
     * @returns Encoded varstr
     */
    static encode(s) {
        // Encode the length of the string using encodeVarInt
        const lengthBuffer = VarInt_1.default.encode(s.length);
        // Concat the actual string right after the length of the string
        return Buffer.concat([lengthBuffer, s]);
    }
    /**
     * Decode a variable length string from a Buffer into a string buffer.
     * Reference: https://github.com/buidl-bitcoin/buidl-python/blob/d79e9808e8ca60975d315be41293cb40d968626d/buidl/helper.py#L194
     * @param v Varstr to be decoded
     * @returns Decoded string buffer
     */
    static decode(v) {
        // Find the length of the string by using read_varint on the string
        const length = VarInt_1.default.decode(v);
        // Get the length of the VarInt used to represent the length of the string
        const lengthByteLength = VarInt_1.default.encode(length).byteLength;
        // Return from lengthByteLength to (length + lengthByteLength) in the buffer which contain the actual string
        return v.subarray(lengthByteLength, length + lengthByteLength);
    }
}
exports.default = VarStr;
//# sourceMappingURL=VarStr.js.map
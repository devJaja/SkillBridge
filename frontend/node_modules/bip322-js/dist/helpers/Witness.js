"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import dependencies
const VarInt_1 = __importDefault(require("./VarInt"));
const VarStr_1 = __importDefault(require("./VarStr"));
/**
 * Class that implement witness data serialization and deserialization.
 */
class Witness {
    /**
     * Encode array of witness into its base-64 encoded format.
     * Follows the encoding scheme found in buidl-python:
     *      https://github.com/buidl-bitcoin/buidl-python/blob/d79e9808e8ca60975d315be41293cb40d968626d/buidl/witness.py#L35
     * @param witnesses Array of witness data
     * @returns Base-64 encoded witness data
     */
    static serialize(witnesses) {
        // The first element to be included is the length of the witness array as VarInt
        let witnessStack = VarInt_1.default.encode(witnesses.length);
        // Then, for each witness array,
        witnesses.forEach((witness) => {
            // Append each witness as a VarStr to the witness stack
            witnessStack = Buffer.concat([witnessStack, VarStr_1.default.encode(Buffer.from(witness))]);
        });
        // Return the base-64 encoded witness stack
        return witnessStack.toString('base64');
    }
    /**
     * Decode encoded witness data, either as a base-64 encoded string or as a decoded string in a buffer, into an array of witness.
     * Follows the decoding scheme found in buidl-python:
     *      https://github.com/buidl-bitcoin/buidl-python/blob/d79e9808e8ca60975d315be41293cb40d968626d/buidl/witness.py#L62
     * @param encodedWitness Base-64 encoded witness data, or encoded witness data that have already been decoded
     * @returns Decoded witness data
     */
    static deserialize(encodedWitness) {
        // Store the decoded witness stack
        let witnessDecoded = [];
        // Preprocess the encodedWitness if needed
        let witnessToDecode;
        if (typeof encodedWitness === 'string') {
            // Decode the encoded witness if it is a string (assuming it is encoded using base-64)
            witnessToDecode = Buffer.from(encodedWitness, 'base64');
        }
        else {
            witnessToDecode = encodedWitness;
        }
        // Read a VarInt which indicate the number of elements within the original witness array
        const witnessCount = VarInt_1.default.decode(witnessToDecode);
        // Slice the VarInt in front of the witness buffer before decoding each witness
        const varIntLength = VarInt_1.default.encode(witnessCount).byteLength;
        witnessToDecode = witnessToDecode.subarray(varIntLength);
        // Loop for each witness encoded
        for (let i = 0; i < witnessCount; i++) {
            // Read a VarStr from the remaining buffer
            const witness = VarStr_1.default.decode(witnessToDecode);
            // Append the decoded witness to witnessDecoded
            witnessDecoded.push(witness);
            // Slice the read witness off witnessToDecode before next iteration
            const witnessLength = VarStr_1.default.encode(witness).byteLength;
            witnessToDecode = witnessToDecode.subarray(witnessLength);
        }
        // Return deserialized witness data
        return witnessDecoded;
    }
}
exports.default = Witness;
//# sourceMappingURL=Witness.js.map
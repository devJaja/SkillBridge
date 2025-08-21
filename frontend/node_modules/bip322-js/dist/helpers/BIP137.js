"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import dependencies
const secp256k1_1 = __importDefault(require("secp256k1"));
const bitcoinMessage = __importStar(require("bitcoinjs-message"));
/**
 * Class that implement BIP137-related utility functions.
 */
class BIP137 {
    /**
     * Check if a given signature satisified the format of a BIP-137 signature.
     * @param signature Base64-encoded signature to be checked
     * @returns True if the provided signature correspond to a valid BIP-137 signature, false if otherwise
     */
    static isBIP137Signature(signature) {
        // Check if the provided signature satisified the format of a BIP-137 signature
        const signatureBuffer = Buffer.from(signature, 'base64');
        if (signatureBuffer.byteLength === 65) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Derive the public key that signed a valid BIP-137 signature.
     * @param message Message signed by the signature
     * @param signature Base-64 encoded signature to be decoded
     * @returns Public key that signs the provided signature
     */
    static derivePubKey(message, signature) {
        // Compute the hash signed by the signer
        const messageHash = bitcoinMessage.magicHash(message);
        // Decode the provided BIP-137 signature
        const signatureDecoded = this.decodeSignature(Buffer.from(signature, 'base64'));
        // Recover the public key
        return Buffer.from(secp256k1_1.default.ecdsaRecover(signatureDecoded.signature, signatureDecoded.recovery, messageHash, signatureDecoded.compressed));
    }
    /**
     * Decode a BIP-137 signature.
     * Function copied from bitcoinjs-message library.
     * @param signature BIP-137 signature to be decoded
     * @returns Decoded BIP-137 signature
     */
    static decodeSignature(signature) {
        if (signature.length !== 65)
            throw new Error('Invalid signature length');
        const flagByte = signature.readUInt8(0) - 27;
        if (flagByte > 19 || flagByte < 0) {
            throw new Error('Invalid signature parameter');
        }
        return {
            compressed: !!(flagByte & 12),
            recovery: flagByte & 3,
            signature: signature.subarray(1)
        };
    }
}
exports.default = BIP137;
//# sourceMappingURL=BIP137.js.map
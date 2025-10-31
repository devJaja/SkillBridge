/// <reference types="node" />
/**
 * Class that implement BIP137-related utility functions.
 */
declare class BIP137 {
    /**
     * Check if a given signature satisified the format of a BIP-137 signature.
     * @param signature Base64-encoded signature to be checked
     * @returns True if the provided signature correspond to a valid BIP-137 signature, false if otherwise
     */
    static isBIP137Signature(signature: string): boolean;
    /**
     * Derive the public key that signed a valid BIP-137 signature.
     * @param message Message signed by the signature
     * @param signature Base-64 encoded signature to be decoded
     * @returns Public key that signs the provided signature
     */
    static derivePubKey(message: string, signature: string): Buffer;
    /**
     * Decode a BIP-137 signature.
     * Function copied from bitcoinjs-message library.
     * @param signature BIP-137 signature to be decoded
     * @returns Decoded BIP-137 signature
     */
    private static decodeSignature;
}
export default BIP137;

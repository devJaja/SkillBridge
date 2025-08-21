/// <reference types="node" />
/**
 * Class that implement key-related utility functions.
 */
declare class Key {
    /**
     * Converts a 33-byte Bitcoin public key to a 32-byte x-only public key as used in Taproot.
     * This function checks if the provided public key buffer is already 32 bytes long,
     * in which case it returns the buffer unchanged. If the buffer is 33 bytes long, it
     * assumes that the first byte is the parity byte used for indicating the y-coordinate
     * in traditional SEC1 encoding and removes this byte, thereby converting the public key
     * to an x-only format suitable for use with Bitcoin's Taproot.
     *
     * Adopted from https://github.com/ACken2/bip322-js/pull/6 by Czino
     *
     * @param publicKey The buffer containing the 33-byte or 32-byte public key to be converted.
     * @returns A 32-byte buffer of the x-only public key.
     * @throws If the public key is neither 32-byte nor 33-byte long
     */
    static toXOnly(publicKey: Buffer): Buffer;
    /**
     * Compresses an uncompressed public key using the elliptic curve secp256k1.
     * This method takes a public key in its uncompressed form and returns a compressed
     * representation of the public key. Elliptic curve public keys can be represented in
     * a shorter form known as compressed format which saves space and still retains the
     * full public key's capabilities. The method uses the elliptic library to convert the
     * uncompressed public key into its compressed form.
     *
     * The steps involved in the process are:
     * 1. Initialize a new elliptic curve instance for the secp256k1 curve.
     * 2. Create a key pair object from the uncompressed public key buffer.
     * 3. Extract the compressed public key from the key pair object.
     * 4. Return the compressed public key as a Buffer object.
     *
     * @param uncompressedPublicKey A Buffer containing the uncompressed public key.
     * @return Buffer Returns a Buffer containing the compressed public key.
     * @throws Error Throws an error if the provided public key cannot be compressed,
     *         typically indicating that the key is not valid.
     */
    static compressPublicKey(uncompressedPublicKey: Buffer): Buffer;
    /**
     * Uncompresses a given public key using the elliptic curve secp256k1.
     * This method accepts a compressed public key and attempts to convert it into its
     * uncompressed form. Public keys are often compressed to save space, but certain
     * operations require the full uncompressed key. This method uses the elliptic
     * library to perform the conversion.
     *
     * The function operates as follows:
     * 1. Initialize a new elliptic curve instance using secp256k1.
     * 2. Attempt to create a key pair from the compressed public key buffer.
     * 3. Extract the uncompressed public key from the key pair object.
     * 4. Return the uncompressed public key as a Buffer object.
     * If the compressed public key provided is invalid and cannot be uncompressed,
     * the method will throw an error with a descriptive message.
     *
     * @param compressedPublicKey A Buffer containing the compressed public key.
     * @return Buffer The uncompressed public key as a Buffer.
     * @throws Error Throws an error if the provided public key cannot be uncompressed,
     *         typically indicating that the key is not valid.
     */
    static uncompressPublicKey(compressedPublicKey: Buffer): Buffer;
}
export default Key;

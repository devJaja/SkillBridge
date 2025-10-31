/**
 * Class that handles BIP-322 signature verification.
 * Reference: https://github.com/LegReq/bip0322-signatures/blob/master/BIP0322_verification.ipynb
 */
declare class Verifier {
    /**
     * Verify a BIP-322 signature from P2WPKH, P2SH-P2WPKH, and single-key-spend P2TR address.
     * @param signerAddress Address of the signing address
     * @param message message_challenge signed by the address
     * @param signatureBase64 Signature produced by the signing address
     * @param useStrictVerification If true, apply strict BIP-137 verification and enforce address flag verification; otherwise, address flag is ignored during verification
     * @returns True if the provided signature is a valid BIP-322 signature for the given message and address, false if otherwise
     * @throws If the provided signature fails basic validation, or if unsupported address and signature are provided
     */
    static verifySignature(signerAddress: string, message: string, signatureBase64: string, useStrictVerification?: boolean): boolean;
    /**
     * Verify a legacy BIP-137 signature.
     * Note that a signature is considered valid for all types of addresses that can be derived from the recovered public key.
     * @param signerAddress Address of the signing address
     * @param message message_challenge signed by the address
     * @param signatureBase64 Signature produced by the signing address
     * @param useStrictVerification If true, apply strict BIP-137 verification and enforce address flag verification; otherwise, address flag is ignored during verification
     * @returns True if the provided signature is a valid BIP-137 signature for the given message and address, false if otherwise
     * @throws If the provided signature fails basic validation, or if unsupported address and signature are provided
     */
    private static verifyBIP137Signature;
    /**
     * Wraps the Bitcoin message verification process to avoid throwing exceptions.
     * This method attempts to verify a BIP-137 message using the provided address and
     * signature. It encapsulates the verification process within a try-catch block,
     * catching any errors that occur during verification and returning false instead
     * of allowing the exception to propagate.
     *
     * The process is as follows:
     * 1. The `bitcoinjs-message.verify` function is called with the message, address,
     *    and signature provided in Base64 encoding.
     * 2. If the verification is successful, the method returns true.
     * 3. If any error occurs during the verification, the method catches the error
     *    and returns false, signaling an unsuccessful verification.
     *
     * @param message The Bitcoin message to be verified.
     * @param address The Bitcoin address to which the message is allegedly signed.
     * @param signatureBase64 The Base64 encoded signature corresponding to the message.
     * @return boolean Returns true if the message is successfully verified, otherwise false.
     */
    private static bitcoinMessageVerifyWrap;
    /**
     * Compute the hash to be signed for a given P2WPKH BIP-322 toSign transaction.
     * @param toSignTx PSBT instance of the toSign transaction
     * @returns Computed transaction hash that requires signing
     */
    private static getHashForSigP2WPKH;
    /**
     * Compute the hash to be signed for a given P2SH-P2WPKH BIP-322 toSign transaction.
     * @param toSignTx PSBT instance of the toSign transaction
     * @param hashedPubkey Hashed public key of the signing address
     * @returns Computed transaction hash that requires signing
     */
    private static getHashForSigP2SHInP2WPKH;
    /**
     * Compute the hash to be signed for a given P2TR BIP-322 toSign transaction.
     * @param toSignTx PSBT instance of the toSign transaction
     * @param hashType Hash type used to sign the toSign transaction, must be either 0x00 or 0x01
     * @returns Computed transaction hash that requires signing
     * @throws Error if hashType is anything other than 0x00 or 0x01
     */
    private static getHashForSigP2TR;
}
export default Verifier;

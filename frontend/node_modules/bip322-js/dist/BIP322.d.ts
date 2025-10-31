/// <reference types="node" />
import * as bitcoin from 'bitcoinjs-lib';
/**
 * Class that handles BIP-322 related operations.
 * Reference: https://github.com/LegReq/bip0322-signatures/blob/master/BIP0322_signing.ipynb
 */
declare class BIP322 {
    static TAG: Buffer;
    /**
     * Compute the message hash as specified in the BIP-322.
     * The standard is specified in BIP-340 as:
     *      The function hashtag(x) where tag is a UTF-8 encoded tag name and x is a byte array returns the 32-byte hash SHA256(SHA256(tag) || SHA256(tag) || x).
     * @param message Message to be hashed
     * @returns Hashed message
     */
    static hashMessage(message: string): Uint8Array;
    /**
     * Build a to_spend transaction using simple signature in accordance to the BIP-322.
     * @param message Message to be signed using BIP-322
     * @param scriptPublicKey The script public key for the signing wallet
     * @returns Bitcoin transaction that correspond to the to_spend transaction
     */
    static buildToSpendTx(message: string, scriptPublicKey: Buffer): bitcoin.Transaction;
    /**
     * Build a to_sign transaction using simple signature in accordance to the BIP-322.
     * @param toSpendTxId Transaction ID of the to_spend transaction as constructed by buildToSpendTx
     * @param witnessScript The script public key for the signing wallet, or the redeemScript for P2SH-P2WPKH address
     * @param isRedeemScript Set to true if the provided witnessScript is a redeemScript for P2SH-P2WPKH address, default to false
     * @param tapInternalKey Used to set the taproot internal public key of a taproot signing address when provided, default to undefined
     * @returns Ready-to-be-signed bitcoinjs.Psbt transaction
     */
    static buildToSignTx(toSpendTxId: string, witnessScript: Buffer, isRedeemScript?: boolean, tapInternalKey?: Buffer): bitcoin.Psbt;
    /**
     * Encode witness stack in a signed BIP-322 PSBT into its base-64 encoded format.
     * @param signedPsbt Signed PSBT
     * @returns Base-64 encoded witness data
     */
    static encodeWitness(signedPsbt: bitcoin.Psbt): string;
}
export default BIP322;

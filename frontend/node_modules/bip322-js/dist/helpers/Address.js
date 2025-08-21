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
// Import dependency
const Key_1 = __importDefault(require("./Key"));
const bitcoin = __importStar(require("bitcoinjs-lib"));
/**
 * Class that implement address-related utility functions.
 */
class Address {
    /**
     * Check if a given Bitcoin address is a pay-to-public-key-hash (p2pkh) address.
     * @param address Bitcoin address to be checked
     * @returns True if the provided address correspond to a valid P2PKH address, false if otherwise
     */
    static isP2PKH(address) {
        // Check if the provided address is a P2PKH address
        if (address[0] === '1' || address[0] === 'm' || address[0] === 'n') {
            return true; // P2PKH address
        }
        else {
            return false;
        }
    }
    /**
     * Check if a given Bitcoin address is a pay-to-script-hash (P2SH) address.
     * @param address Bitcoin address to be checked
     * @returns True if the provided address correspond to a valid P2SH address, false if otherwise
     */
    static isP2SH(address) {
        // Check if the provided address is a P2SH address
        if (address[0] === '3' || address[0] === '2') {
            return true; // P2SH address
        }
        else {
            return false;
        }
    }
    /**
     * Check if a given Bitcoin address is a pay-to-witness-public-key-hash (P2WPKH) address.
     * @param address Bitcoin address to be checked
     * @returns True if the provided address correspond to a valid P2WPKH address, false if otherwise
     */
    static isP2WPKH(address) {
        // Check if the provided address is a P2WPKH/P2WSH address
        if (/^(bc1q|tb1q|bcrt1q)/.test(address)) {
            // Either a P2WPKH / P2WSH address
            // Convert the address into a scriptPubKey
            const scriptPubKey = this.convertAdressToScriptPubkey(address);
            // Check if the scriptPubKey is exactly 22 bytes since P2WPKH scriptPubKey should be 0014<20-BYTE-PUBKEY-HASH>
            if (scriptPubKey.byteLength === 22) {
                return true; // P2WPKH
            }
            else {
                return false; // Not P2WPKH, probably P2WSH
            }
        }
        else {
            return false;
        }
    }
    /**
     * Check if a given Bitcoin address is a taproot address.
     * @param address Bitcoin address to be checked
     * @returns True if the provided address is a taproot address, false if otherwise
     */
    static isP2TR(address) {
        if (/^(bc1p|tb1p|bcrt1p)/.test(address)) {
            return true; // P2TR address
        }
        else {
            return false;
        }
    }
    /**
     * Check if a given witness stack corresponds to a P2WPKH address.
     * @param witness Witness data associated with the toSign BIP-322 transaction
     * @returns True if the provided witness stack correspond to a valid P2WPKH address, false if otherwise
     */
    static isP2WPKHWitness(witness) {
        // Check whether the witness stack is as expected for a P2WPKH address
        // It should contain exactly two items, with the second item being a public key with 33 bytes, and the first byte must be either 0x02/0x03
        if (witness.length === 2 && witness[1].byteLength === 33 && (witness[1][0] === 0x02 || witness[1][0] === 0x03)) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Check if a given witness stack corresponds to a single-key-spend P2TR address.
     * @param witness Witness data associated with the toSign BIP-322 transaction
     * @returns True if the provided address and witness stack correspond to a valid single-key-spend P2TR address, false if otherwise
     */
    static isSingleKeyP2TRWitness(witness) {
        // Check whether the witness stack is as expected for a single-key-spend taproot address
        // It should contain exactly one items which is the signature for the transaction
        if (witness.length === 1) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Determine network type by checking addresses prefixes
     * Reference: https://en.bitcoin.it/wiki/List_of_address_prefixes
     *
     * Adopted from https://github.com/ACken2/bip322-js/pull/6 by Czino
     *
     * @param address Bitcoin address
     * @returns Network type
     * @throws If the address type is not recognized
     */
    static getNetworkFromAddess(address) {
        if (/^(bc1q|bc1p|1|3)/.test(address)) {
            return bitcoin.networks.bitcoin;
        }
        else if (/^(tb1q|tb1p|2|m|n)/.test(address)) {
            return bitcoin.networks.testnet;
        }
        else if (/^(bcrt1q|bcrt1p)/.test(address)) {
            return bitcoin.networks.regtest;
        }
        throw new Error("Unknown address type");
    }
    /**
     * Convert a given Bitcoin address into its corresponding script public key.
     * Reference: https://github.com/buidl-bitcoin/buidl-python/blob/d79e9808e8ca60975d315be41293cb40d968626d/buidl/script.py#L607
     * @param address Bitcoin address
     * @returns Script public key of the given Bitcoin address
     * @throws Error when the provided address is not a valid Bitcoin address
     */
    static convertAdressToScriptPubkey(address) {
        if (address[0] === '1' || address[0] === 'm' || address[0] === 'n') {
            // P2PKH address
            return bitcoin.payments.p2pkh({
                address: address,
                network: this.getNetworkFromAddess(address)
            }).output;
        }
        else if (address[0] === '3' || address[0] === '2') {
            // P2SH address
            return bitcoin.payments.p2sh({
                address: address,
                network: this.getNetworkFromAddess(address)
            }).output;
        }
        else if (/^(bc1q|tb1q|bcrt1q)/.test(address)) {
            // P2WPKH or P2WSH address
            if (address.length === 42 || (address.includes('bcrt1q') && address.length === 44)) {
                // P2WPKH address
                return bitcoin.payments.p2wpkh({
                    address: address,
                    network: this.getNetworkFromAddess(address)
                }).output;
            }
            else if (address.length === 62 || (address.includes('bcrt1q') && address.length === 64)) {
                // P2WSH address
                return bitcoin.payments.p2wsh({
                    address: address,
                    network: this.getNetworkFromAddess(address)
                }).output;
            }
        }
        else if (/^(bc1p|tb1p|bcrt1p)/.test(address)) {
            if (address.length === 62 || (address.includes('bcrt1p') && address.length === 64)) {
                // P2TR address
                return bitcoin.payments.p2tr({
                    address: address,
                    network: this.getNetworkFromAddess(address)
                }).output;
            }
        }
        throw new Error("Unknown address type");
    }
    /**
     * Convert a given public key into a corresponding Bitcoin address.
     * @param publicKey Public key for deriving the address, or internal public key for deriving taproot address
     * @param addressType Bitcoin address type to be derived, must be either 'p2pkh', 'p2sh-p2wpkh', 'p2wpkh', or 'p2tr'
     * @returns Bitcoin address that correspond to the given public key in both mainnet and testnet
     */
    static convertPubKeyIntoAddress(publicKey, addressType) {
        switch (addressType) {
            case 'p2pkh':
                return {
                    mainnet: bitcoin.payments.p2pkh({ pubkey: publicKey, network: bitcoin.networks.bitcoin }).address,
                    testnet: bitcoin.payments.p2pkh({ pubkey: publicKey, network: bitcoin.networks.testnet }).address,
                    regtest: bitcoin.payments.p2pkh({ pubkey: publicKey, network: bitcoin.networks.regtest }).address
                };
            case 'p2sh-p2wpkh':
                // Reference: https://github.com/bitcoinjs/bitcoinjs-lib/blob/1a9119b53bcea4b83a6aa8b948f0e6370209b1b4/test/integration/addresses.spec.ts#L70
                return {
                    mainnet: bitcoin.payments.p2sh({
                        redeem: bitcoin.payments.p2wpkh({ pubkey: publicKey, network: bitcoin.networks.bitcoin }),
                        network: bitcoin.networks.bitcoin
                    }).address,
                    testnet: bitcoin.payments.p2sh({
                        redeem: bitcoin.payments.p2wpkh({ pubkey: publicKey, network: bitcoin.networks.testnet }),
                        network: bitcoin.networks.testnet
                    }).address,
                    regtest: bitcoin.payments.p2sh({
                        redeem: bitcoin.payments.p2wpkh({ pubkey: publicKey, network: bitcoin.networks.regtest }),
                        network: bitcoin.networks.regtest
                    }).address
                };
            case 'p2wpkh':
                return {
                    mainnet: bitcoin.payments.p2wpkh({ pubkey: publicKey, network: bitcoin.networks.bitcoin }).address,
                    testnet: bitcoin.payments.p2wpkh({ pubkey: publicKey, network: bitcoin.networks.testnet }).address,
                    regtest: bitcoin.payments.p2wpkh({ pubkey: publicKey, network: bitcoin.networks.regtest }).address
                };
            case 'p2tr':
                // Convert full-length public key into internal public key if necessary
                const internalPubkey = Key_1.default.toXOnly(publicKey);
                return {
                    mainnet: bitcoin.payments.p2tr({ internalPubkey: internalPubkey, network: bitcoin.networks.bitcoin }).address,
                    testnet: bitcoin.payments.p2tr({ internalPubkey: internalPubkey, network: bitcoin.networks.testnet }).address,
                    regtest: bitcoin.payments.p2tr({ internalPubkey: internalPubkey, network: bitcoin.networks.regtest }).address
                };
            default:
                throw new Error('Cannot convert public key into unsupported address type.');
        }
    }
    /**
     * Validates a given Bitcoin address.
     * This method checks if the provided Bitcoin address is valid by attempting to decode it
     * for different Bitcoin networks: mainnet, testnet, and regtest. The method uses the
     * bitcoinjs-lib's address module for decoding.
     *
     * The process is as follows:
     * 1. Attempt to decode the address for the Bitcoin mainnet. If decoding succeeds,
     *    the method returns true, indicating the address is valid for mainnet.
     * 2. If the first step fails, catch the resulting error and attempt to decode the
     *    address for the Bitcoin testnet. If decoding succeeds, the method returns true,
     *    indicating the address is valid for testnet.
     * 3. If the second step fails, catch the resulting error and attempt to decode the
     *    address for the Bitcoin regtest network. If decoding succeeds, the method returns
     *    true, indicating the address is valid for regtest.
     * 4. If all attempts fail, the method returns false, indicating the address is not valid
     *    for any of the checked networks.
     *
     * @param address The Bitcoin address to validate.
     * @return boolean Returns true if the address is valid for any of the Bitcoin networks,
     *                 otherwise returns false.
     */
    static isValidBitcoinAddress(address) {
        try {
            // Attempt to decode the address using bitcoinjs-lib's address module at mainnet
            bitcoin.address.toOutputScript(address, bitcoin.networks.bitcoin);
            return true; // If decoding succeeds, the address is valid
        }
        catch (error) { }
        try {
            // Attempt to decode the address using bitcoinjs-lib's address module at testnet
            bitcoin.address.toOutputScript(address, bitcoin.networks.testnet);
            return true; // If decoding succeeds, the address is valid
        }
        catch (error) { }
        try {
            // Attempt to decode the address using bitcoinjs-lib's address module at regtest
            bitcoin.address.toOutputScript(address, bitcoin.networks.regtest);
            return true; // If decoding succeeds, the address is valid
        }
        catch (error) { }
        return false; // Probably not a valid address
    }
}
exports.default = Address;
//# sourceMappingURL=Address.js.map
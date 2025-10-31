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
exports.Witness = exports.Key = exports.BIP137 = exports.Address = exports.Verifier = exports.Signer = exports.BIP322 = void 0;
// Import modules to be exported
const BIP322_1 = __importDefault(require("./BIP322"));
exports.BIP322 = BIP322_1.default;
const Signer_1 = __importDefault(require("./Signer"));
exports.Signer = Signer_1.default;
const Verifier_1 = __importDefault(require("./Verifier"));
exports.Verifier = Verifier_1.default;
const helpers_1 = require("./helpers");
Object.defineProperty(exports, "Address", { enumerable: true, get: function () { return helpers_1.Address; } });
Object.defineProperty(exports, "BIP137", { enumerable: true, get: function () { return helpers_1.BIP137; } });
Object.defineProperty(exports, "Key", { enumerable: true, get: function () { return helpers_1.Key; } });
Object.defineProperty(exports, "Witness", { enumerable: true, get: function () { return helpers_1.Witness; } });
// Provide a ECC library to bitcoinjs-lib
const secp256k1_1 = __importDefault(require("@bitcoinerlab/secp256k1"));
const bitcoin = __importStar(require("bitcoinjs-lib"));
bitcoin.initEccLib(secp256k1_1.default);
//# sourceMappingURL=index.js.map
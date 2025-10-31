/// <reference types="node" />
interface ScriptSignature {
    signature: Buffer;
    hashType: number;
}
export declare function decodeScriptSignature(buffer: Buffer): ScriptSignature;
export {};

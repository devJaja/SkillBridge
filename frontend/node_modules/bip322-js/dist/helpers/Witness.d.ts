/// <reference types="node" />
/**
 * Class that implement witness data serialization and deserialization.
 */
declare class Witness {
    /**
     * Encode array of witness into its base-64 encoded format.
     * Follows the encoding scheme found in buidl-python:
     *      https://github.com/buidl-bitcoin/buidl-python/blob/d79e9808e8ca60975d315be41293cb40d968626d/buidl/witness.py#L35
     * @param witnesses Array of witness data
     * @returns Base-64 encoded witness data
     */
    static serialize(witnesses: Uint8Array[]): string;
    /**
     * Decode encoded witness data, either as a base-64 encoded string or as a decoded string in a buffer, into an array of witness.
     * Follows the decoding scheme found in buidl-python:
     *      https://github.com/buidl-bitcoin/buidl-python/blob/d79e9808e8ca60975d315be41293cb40d968626d/buidl/witness.py#L62
     * @param encodedWitness Base-64 encoded witness data, or encoded witness data that have already been decoded
     * @returns Decoded witness data
     */
    static deserialize(encodedWitness: string | Buffer): Buffer[];
}
export default Witness;

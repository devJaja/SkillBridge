/// <reference types="node" />
/**
 * Class that implement variable length integer (VarInt) in Javascript.
 * Reference: https://en.bitcoin.it/wiki/Protocol_documentation#Variable_length_integer
 */
declare class VarInt {
    /**
     * Encode an integer i as a variable length integer.
     * Reference: https://github.com/buidl-bitcoin/buidl-python/blob/d79e9808e8ca60975d315be41293cb40d968626d/buidl/helper.py#L180
     * @param i Integer to be encoded
     * @returns Encoded varint
     */
    static encode(i: number): Buffer;
    /**
     * Decode a variable length integer from a Buffer into a number.
     * Reference: https://github.com/buidl-bitcoin/buidl-python/blob/d79e9808e8ca60975d315be41293cb40d968626d/buidl/helper.py#L160
     * @param b Buffer which contain the varint
     * @returns Decoded number
     */
    static decode(b: Buffer): number;
}
export default VarInt;

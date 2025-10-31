/// <reference types="node" />
/**
 * Class that implement variable length string (VarStr) in Javascript.
 * Reference: https://en.bitcoin.it/wiki/Protocol_documentation#Variable_length_string
 */
declare class VarStr {
    /**
     * Encode a string buffer as a variable length string.
     * Reference: https://github.com/buidl-bitcoin/buidl-python/blob/d79e9808e8ca60975d315be41293cb40d968626d/buidl/helper.py#L203
     * @param s String buffer to be encoded
     * @returns Encoded varstr
     */
    static encode(s: Buffer): Buffer;
    /**
     * Decode a variable length string from a Buffer into a string buffer.
     * Reference: https://github.com/buidl-bitcoin/buidl-python/blob/d79e9808e8ca60975d315be41293cb40d968626d/buidl/helper.py#L194
     * @param v Varstr to be decoded
     * @returns Decoded string buffer
     */
    static decode(v: Buffer): Buffer;
}
export default VarStr;

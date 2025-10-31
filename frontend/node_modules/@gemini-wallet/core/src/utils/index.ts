export {
  base64ToHex,
  bufferToBase64URLString,
  decodeBase64,
  encodeBase64,
  utf8StringToBuffer,
} from "./base64";
export { closePopup, openPopup } from "./popup";
export { hexStringFromNumber, safeJsonStringify } from "./strings";

export const generateRequestId = (): string => crypto.randomUUID();

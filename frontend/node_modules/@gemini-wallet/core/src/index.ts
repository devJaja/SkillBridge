// Main exports
export { Communicator } from "./communicator";

// Provider exports
export { GeminiWalletProvider } from "./provider";
export * from "./provider/provider.utils";

// Wallet exports
export { GeminiWallet } from "./wallets";

// Storage exports
export {
  GeminiStorage,
  STORAGE_ETH_ACCOUNTS_KEY,
  STORAGE_ETH_ACTIVE_CHAIN_KEY,
  STORAGE_PASSKEY_CREDENTIAL_KEY,
  STORAGE_SETTINGS_KEY,
  STORAGE_SMART_ACCOUNT_KEY,
} from "./storage";
export type { IStorage } from "./storage";

// Type exports
export type {
  AppMetadata,
  AppContext,
  Chain,
  PlatformType,
  GeminiProviderConfig,
  RpcRequestArgs,
  ProviderRpcError,
  ProviderEventMap,
  ProviderEventCallback,
  ProviderInterface,
  GeminiSdkMessage,
  GeminiSdkMessageResponse,
  ConnectResponse,
  SendTransactionResponse,
  SignMessageResponse,
  SignTypedDataResponse,
  SwitchChainResponse,
  GeminiSdkSendTransaction,
  GeminiSdkSignMessage,
  GeminiSdkSignTypedData,
  GeminiSdkSwitchChain,
  GeminiSdkAppContextMessage,
} from "./types";

export { GeminiSdkEvent, ProviderEventEmitter } from "./types";

// Utility exports
export { 
  openPopup, 
  closePopup,
  generateRequestId,
  hexStringFromNumber,
  encodeBase64,
  decodeBase64,
  bufferToBase64URLString,
  utf8StringToBuffer,
  base64ToHex,
  safeJsonStringify
} from "./utils";

// Constants
export { 
  SDK_BACKEND_URL, 
  SDK_VERSION,
  DEFAULT_CHAIN_ID,
  POPUP_WIDTH,
  POPUP_HEIGHT
} from "./constants";
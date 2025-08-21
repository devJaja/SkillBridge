export const SDK_BACKEND_URL = "https://keys.gemini.com";
export const SDK_VERSION = "0.1.0";
export const DEFAULT_CHAIN_ID = 42161; // Arbitrum One

// Mainnet chain IDs
export const MAINNET_CHAIN_IDS = {
  ETHEREUM: 1,
  ARBITRUM_ONE: 42161,
  OP_MAINNET: 10,
  BASE: 8453,
  POLYGON: 137,
} as const;

// Testnet chain IDs
export const TESTNET_CHAIN_IDS = {
  SEPOLIA: 11155111,
  ARBITRUM_SEPOLIA: 421614,
  OP_SEPOLIA: 11155420,
  BASE_SEPOLIA: 84532,
  POLYGON_AMOY: 80002,
} as const;

// All supported chain IDs
export const SUPPORTED_CHAIN_IDS = [
  ...Object.values(MAINNET_CHAIN_IDS),
  ...Object.values(TESTNET_CHAIN_IDS),
];

// Popup window dimensions
export const POPUP_WIDTH = 420;
export const POPUP_HEIGHT = 650;
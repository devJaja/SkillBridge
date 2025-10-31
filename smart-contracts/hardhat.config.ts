require("ts-node/register");

const { HardhatUserConfig } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    "Hadera-testnet": {
      url: process.env.HADERA_RPC_URL || "",
      accounts: [process.env.HADERA_PRIVATE_KEY || ""],
    },
  },
};

module.exports = config;
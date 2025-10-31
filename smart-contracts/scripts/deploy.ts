import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
dotenv.config();

async function main() {
  try {
    // Get configuration from environment variables
    const RPC_URL = process.env.HADERA_RPC_URL;
    const PRIVATE_KEY = process.env.HADERA_PRIVATE_KEY;

    if (!RPC_URL) {
      throw new Error("HADERA_RPC_URL not found in .env file");
    }

    if (!PRIVATE_KEY) {
      throw new Error("HADERA_PRIVATE_KEY not found in .env file");
    }

    // Create provider and wallet with timeout settings
    console.log("Connecting to Hedera testnet...");
    console.log("RPC URL:", RPC_URL);
    
    const provider = new ethers.JsonRpcProvider(RPC_URL, undefined, {
      staticNetwork: ethers.Network.from({
        name: "hedera-testnet",
        chainId: 296
      }),
      batchMaxCount: 1,
    });
    
    const deployer = new ethers.Wallet(PRIVATE_KEY, provider);

    console.log("Deploying contracts with the account:", deployer.address);
    
    // Check balance
    const balance = await provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "HBAR");

    if (balance === 0n) {
      throw new Error("Account has no balance. Please fund your account from the Hedera testnet faucet at https://portal.hedera.com");
    }

    console.log("\nDeploying SkillBridge...");
    
    // Use process.cwd() to get the correct working directory
    const artifactPath = join(process.cwd(), 'artifacts', 'contracts', 'SkillBridge.sol', 'SkillBridge.json');
    
    console.log("Reading artifact from:", artifactPath);
    
    let SkillBridgeArtifact;
    try {
      const artifactContent = readFileSync(artifactPath, 'utf8');
      SkillBridgeArtifact = JSON.parse(artifactContent);
    } catch (error) {
      console.error("\n❌ Failed to read artifact file.");
      console.error("Make sure you've compiled the contracts first:");
      console.error("Run: npx hardhat compile\n");
      throw error;
    }
    
    // Create contract factory
    const SkillBridgeFactory = new ethers.ContractFactory(
      SkillBridgeArtifact.abi,
      SkillBridgeArtifact.bytecode,
      deployer
    );
    
    // Deploy the contract
    console.log("Sending deployment transaction...");
    const skillBridge = await SkillBridgeFactory.deploy();
    
    console.log("Waiting for deployment confirmation...");
    await skillBridge.waitForDeployment();

    const address = await skillBridge.getAddress();
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ SkillBridge deployed successfully!");
    console.log("=".repeat(60));
    console.log("Contract address:", address);
    console.log("Network: Hedera Testnet");
    console.log("View on HashScan:", `https://hashscan.io/testnet/contract/${address}`);
    
    const deployTx = skillBridge.deploymentTransaction();
    if (deployTx) {
      console.log("Transaction hash:", deployTx.hash);
    }
    console.log("=".repeat(60) + "\n");
    
    // Save deployment info
    console.log("Save this information for your records:");
    console.log(`Contract Address: ${address}`);
    console.log(`Deployer Address: ${deployer.address}`);
    
  } catch (error) {
    console.error("\n❌ Deployment failed:");
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      
      // Provide helpful error messages
      if (error.message.includes("insufficient funds")) {
        console.error("\n💡 Solution: Get test HBAR from https://portal.hedera.com");
      } else if (error.message.includes("invalid") && error.message.includes("key")) {
        console.error("\n💡 Solution: Check your HADERA_PRIVATE_KEY in .env file (should be 64 characters, no 0x prefix)");
      } else if (error.message.includes("network") || error.message.includes("connect")) {
        console.error("\n💡 Solution: Check your HADERA_RPC_URL in .env file");
        console.error("Should be: https://testnet.hashio.io/api");
      } else if (error.message.includes("not found") || error.message.includes("ENOENT")) {
        console.error("\n💡 Solution: Compile your contracts first with: npx hardhat compile");
      }
    }
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
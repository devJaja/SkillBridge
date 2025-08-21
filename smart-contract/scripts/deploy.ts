import { ethers } from "hardhat";

async function main() {
  console.log("Deploying SkillBridge contract...");

  // Get the contract factory
  const SkillBridge = await ethers.getContractFactory("SkillBridge");

  // Deploy (no constructor args in your contract)
  const skillBridge = await SkillBridge.deploy();

  // Wait for deployment
  await skillBridge.waitForDeployment();

  // Get deployed address
  console.log(`SkillBridge deployed at: ${await skillBridge.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
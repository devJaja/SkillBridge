

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const SkillBridgeModule = buildModule("SkillBridgeModule", (m) => {
  const skillBridge = m.contract("SkillBridge", [], {
    // Optional deployment parameters
    // value: 0, // ETH to send with deployment (if constructor is payable)
    // gasLimit: 5000000, // Gas limit for deployment
  });

  return { skillBridge };
});

export default SkillBridgeModule;


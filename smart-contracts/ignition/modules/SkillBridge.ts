import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SkillBridgeModule", (m) => {
  const skillbridge = m.contract("SkillBridge");


  return { skillbridge };
});

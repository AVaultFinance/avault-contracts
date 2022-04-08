
import { ethers } from "hardhat";

const officialAccount = "0x41BA3387E1a5a592E27B9EE33935957CE5F872C1";

const aKKS = "0x9A6080753a35dCd8e77102aE83A93170A831393e"
const aKSU = "0xc5b8D0eC15984653A7554878eE9b4212EA059Fd2"
const aKES = "0x0Aaf347F50b766cA85dB70f9e2B0E178E9a16F4D"
const aKEU = "0xCA9b609b7a0Bc46CcF744B2e0261B9Afd14f81C0"
const aKBU = "0x8fcbe72710185dd34a8bBBA1Cc05eB2628945FEC"
const aKSJ = "0x5167E12139Ee4b2F6590F3C95E56B29d408a9048"
const aKJU = "0x9d03BfE2e0BEDA103f1961A8595bF5d8b1F6FD18"


async function main() {
  // We get the contract to deploy
//   const IERC20 = await ethers.getContractFactory("IERC20");
  const officialUser = await ethers.getSigner(officialAccount)

  let avault = await ethers.getContractAt("AVaultPCS", aKKS, officialUser);
  let r = await avault.unpause();
  console.log(`r: ${JSON.stringify(r)}`);
  await sleep(18000);

  avault = await ethers.getContractAt("AVaultPCS", aKSU, officialUser);
  r = await avault.unpause();
  console.log(`r: ${JSON.stringify(r)}`);
  await sleep(18000);

  avault = await ethers.getContractAt("AVaultPCS", aKES, officialUser);
  r = await avault.unpause();
  console.log(`r: ${JSON.stringify(r)}`);
  await sleep(18000);

  avault = await ethers.getContractAt("AVaultPCS", aKEU, officialUser);
  r = await avault.unpause();
  console.log(`r: ${JSON.stringify(r)}`);
  await sleep(18000);

  avault = await ethers.getContractAt("AVaultPCS", aKBU, officialUser);
  r = await avault.unpause();
  console.log(`r: ${JSON.stringify(r)}`);
  await sleep(18000);

  avault = await ethers.getContractAt("AVaultPCS", aKSJ, officialUser);
  r = await avault.unpause();
  console.log(`r: ${JSON.stringify(r)}`);
  await sleep(18000);

  avault = await ethers.getContractAt("AVaultPCS", aKJU, officialUser);
  r = await avault.unpause();
  console.log(`r: ${JSON.stringify(r)}`);
}

function sleep(ms:number) {
  console.log(`sleeping ${ms} ms...`);
  return new Promise(resolve => setTimeout(resolve, ms));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

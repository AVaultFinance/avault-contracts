
import { Signer } from "ethers";
import { ethers } from "hardhat";

const officialAccount = "0x41BA3387E1a5a592E27B9EE33935957CE5F872C1";
const treasuryAccount = "0x51dCfc9E04859A0B7647608fbd9Ab34fC8553189";
const proposerAccount = "0x539AD6Acb93c273ad44851D85feC319ABAa64a0d";
const executorAccount = "0x26C1FD9Fd5a1338AABBDbe3F64f3E73369a0F4A0";


let officialUser: Signer;
let timelockAddress: string;
async function main() {
  officialUser = await ethers.getSigner(officialAccount)
  // We get the contract to deploy
  const zapContract = await ethers.getContractFactory("ZapKacoShiden", officialUser);
  const zap = await zapContract.deploy();
  await zap.deployed();
  console.log("zap deployed to:", zap.address);
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

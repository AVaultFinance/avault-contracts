
import { Signer } from "ethers";
import { ethers, upgrades } from "hardhat";

const officialAccount = "0x41BA3387E1a5a592E27B9EE33935957CE5F872C1";
const treasuryAccount = "0x51dCfc9E04859A0B7647608fbd9Ab34fC8553189";
const proposerAccount = "0x539AD6Acb93c273ad44851D85feC319ABAa64a0d";
const executorAccount = "0x26C1FD9Fd5a1338AABBDbe3F64f3E73369a0F4A0";

const proxyAdmin = "0x9A6080753a35dCd8e77102aE83A93170A831393e";
const implementation = "0x0Aaf347F50b766cA85dB70f9e2B0E178E9a16F4D";

let theSigner: Signer;
let timelockAddress: string;
async function main() {
  theSigner = await ethers.getSigner(officialAccount)

  // const c = await ethers.getContractFactory("ZapArthswap", theSigner);
  // const ci = await upgrades.deployProxy(c)
  // await ci.deployed();
  // console.log(`ZapArthswap deployed to: ${ci.address}`)

  //========ungraedable========
  // const cPA = await ethers.getContractFactory("ProxyAdmin", theSigner);
  // const cPAi = await cPA.deploy();
  // console.log(`ProxyAdmin deployed to: ${cPAi.address}`)

  const c = await ethers.getContractFactory("ZapArthswap", theSigner);
  // const ci = await c.deploy();
  // console.log(`ZapArthswap deployed to: ${ci.address}`)

  // await sleep(18000);

  const callData = c.interface.encodeFunctionData("initialize")
  console.log(`calldata: ${callData}`);

  const cTU = await ethers.getContractFactory("TransparentUpgradeableProxy", theSigner);
  const cTUi = await cTU.deploy(implementation, proxyAdmin, callData);
  console.log(`TransparentUpgradeableProxy(ZapArthswap) deployed to: ${cTUi.address}`)


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


import { Signer } from "ethers";
import { ethers } from "hardhat";

const officialAccount = "0x41BA3387E1a5a592E27B9EE33935957CE5F872C1";
const treasuryAccount = "0x51dCfc9E04859A0B7647608fbd9Ab34fC8553189";
const proposerAccount = "0x539AD6Acb93c273ad44851D85feC319ABAa64a0d";
const executorAccount = "0x26C1FD9Fd5a1338AABBDbe3F64f3E73369a0F4A0";

const kac = "0xb12c13e66AdE1F72f71834f2FC5082Db8C091358";
const wsdn = "0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef";
const usdc = "0xfa9343c3897324496a05fc75abed6bac29f8a40f";
const eth = "0x765277eebeca2e31912c9946eae1021199b39c61";
const busd = "0x65e66a61d0a8f1e686c2d6083ad611a10d84d97a";
const jpyc = "0x735aBE48e8782948a37C7765ECb76b98CdE97B0F";

const farmContractAddress = "0x293A7824582C56B0842535f94F6E3841888168C8";
const kacRouterAddress = "0x72e86269b919Db5bDbF61cB1DeCfD6d14feC4D7F";

const kacWsdnAddress = "0x456C0082DE0048EE883881fF61341177FA1FEF40";
const wsdnUsdcAddress = "0xdB9a42E1165bA2fc479e1f2C1ce939807dbe6020";
const ethWsdnAddress = "0xeb2C6d3F1bbe9DA50A0272E80fAA89354630DE88";
const ethUsdcAddress = "0xcfb0e95a3A68E3574C73a3C6985D56B7c03b6348";
const busdUsdcAddress = "0x8644e9AC84273cA0609F2A2B09b2ED2A5aD2e9DD";
const sdnJpycAddress = "0x1Ba530cf929ea5bc7f1Af241495C97331Ddb4f70";
const jpycUsdcAddress = "0xe2c19eb0f91c80275cc254f90ed0f18f26650ec5"


let officialUser: Signer;
let timelockAddress: string;
async function main() {
  officialUser = await ethers.getSigner(officialAccount)
  // We get the contract to deploy
  const timelockContract = await ethers.getContractFactory("RewardsDistributorTimelock", officialUser);
  const timelock = await timelockContract.deploy(86400, [proposerAccount], [executorAccount], treasuryAccount, "0x0000000000000000000000000000000000000000", 0);
  await timelock.deployed();
  console.log("timelock deployed to:", timelock.address);
  timelockAddress = timelock.address;

  await deployVault(kacWsdnAddress, 1, [kac], [kac, wsdn], "avault Kaco KAC-wSDN LP", "aKKS");
  await deployVault(wsdnUsdcAddress, 2, [kac, wsdn], [kac, wsdn, usdc], "avault Kaco wSDN-USDC LP", "aKSU");
  await deployVault(ethWsdnAddress, 3, [kac, wsdn, eth], [kac, wsdn], "avault Kaco ETH-wSDN LP", "aKES");
  await deployVault(ethUsdcAddress, 4, [kac, wsdn, eth], [kac, wsdn, usdc], "avault Kaco ETH-USDC LP", "aKEU");
  await deployVault(busdUsdcAddress, 5, [kac, wsdn, usdc, busd], [kac, wsdn, usdc], "avault Kaco BUSD-USDC LP", "aKBU");
  await deployVault(sdnJpycAddress, 6, [kac, wsdn], [kac, wsdn, jpyc], "avault Kaco wSDN-JPYC LP", "aKSJ");
  await deployVault(jpycUsdcAddress, 7, [kac, wsdn, jpyc], [kac, wsdn, usdc], "avault Kaco JPYC-USDC LP", "aKJU");
}

function sleep(ms:number) {
  console.log(`sleeping ${ms} ms...`);
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function deployVault(lpAddress:string, pid:number, earnToToken0:string[], earnTotoken1:string[], name:string, symbol:string){
  const AVaultPCSContract = await ethers.getContractFactory("AVaultPCS", officialUser);
  const vault = await AVaultPCSContract.deploy([lpAddress, farmContractAddress, kacRouterAddress, kacRouterAddress, timelockAddress], 
    pid, false, [kac, wsdn], [wsdn, kac],
    earnToToken0.slice(), earnTotoken1.slice(),
    earnToToken0.reverse(), earnTotoken1.reverse(),
    name, symbol);
  await vault.deployed();
  console.log(`${symbol} deployed to: ${vault.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


import { ethers } from "hardhat";

const officialAccount = "";

const kac = "0xb12c13e66AdE1F72f71834f2FC5082Db8C091358";
const wsdn = "0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef";
const farmContractAddress = "0x293A7824582C56B0842535f94F6E3841888168C8";
const kacRouterAddress = "0x72e86269b919Db5bDbF61cB1DeCfD6d14feC4D7F";

const kacWsdnLPAddress = "0x456C0082DE0048EE883881fF61341177FA1FEF40";


async function main() {
  // We get the contract to deploy
  const timelockContract = await ethers.getContractFactory("RewardsDistributorTimelock");
  const timelock = await timelockContract.deploy(60, [officialAccount], [officialAccount], "0x56eD0B8e8463c366E6c580fAC7BB6779700C3c22", "0xE7929a6f19B685A6F2C3Fa962054a82B79DC999F", 0);

  await timelock.deployed();

  console.log("timelock deployed to:", timelock.address);

  
  // await sleep(12000);


  const AVaultPCSContract = await ethers.getContractFactory("AVaultPCS");
  const AVaultPCS = await AVaultPCSContract.deploy([kacWsdnLPAddress, farmContractAddress, kacRouterAddress, kacRouterAddress, timelock.address], 
    1, false, [kac, wsdn], 
    [wsdn, kac],
    [kac], [kac, wsdn],
    [kac], [wsdn, kac],
    "Avault Kaco KAC-WSDN LP", "AK-KW");

  await AVaultPCS.deployed();

  console.log("AVaultPCS deployed to:", AVaultPCS.address);
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


import { ethers } from "hardhat";

const officialAccount = "";

const kac = "0xb12c13e66AdE1F72f71834f2FC5082Db8C091358";
const wsdn = "0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef";
const farmContractAddress = "0x293A7824582C56B0842535f94F6E3841888168C8";
const kacRouterAddress = "0x72e86269b919Db5bDbF61cB1DeCfD6d14feC4D7F";

const kacWsdnLPAddress = "0x456C0082DE0048EE883881fF61341177FA1FEF40";

const avaultPCSAddress = "0xFB6Ae2A33e95C21d06A583D762BAfEC0F4967403";


async function main() {
  // We get the contract to deploy
//   const IERC20 = await ethers.getContractFactory("IERC20");
  const token = await ethers.getContractAt("ERC20", kacWsdnLPAddress);
  await token.approve(avaultPCSAddress, "10000000000000000000000")

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

import { Interface } from "ethers/lib/utils";
import { ethers } from "hardhat";
import RouterJson from "../artifacts/contracts/AVaultPCS.sol/AVaultPCS.json";

async function main() {

    const contractABI = new Interface(RouterJson.abi)
    for(const ff in contractABI.functions){
        console.log(`name: ${ff}, sighash: ${contractABI.getSighash(ff)}`);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

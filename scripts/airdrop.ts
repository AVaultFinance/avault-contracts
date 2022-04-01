import { Signer } from "ethers";
import { ethers } from "hardhat";
import addressesArray from "./resource/addressList.json";
import { NonceManager } from "@ethersproject/experimental";

const officialAccount = "0x41BA3387E1a5a592E27B9EE33935957CE5F872C1";
const treasuryAccount = "0x51dCfc9E04859A0B7647608fbd9Ab34fC8553189";
const proposerAccount = "0x539AD6Acb93c273ad44851D85feC319ABAa64a0d";
const executorAccount = "0x26C1FD9Fd5a1338AABBDbe3F64f3E73369a0F4A0";

const multiSendAddress = "0x9a45b203Af044ADACceD4D95ca3cDa020E082c8A";

let officialUser: NonceManager;
async function main() {
  officialUser = new NonceManager(await ethers.getSigner(officialAccount));
  const multiSend = await ethers.getContractAt("MultiSend", multiSendAddress, officialUser);

  const bondNum = 3;
  let bondAddresses: string[] = [];
  for (const i in addressesArray) {
    if (ethers.utils.isAddress(addressesArray[i])) {
      bondAddresses.push(addressesArray[i]);

      if (bondAddresses.length >= bondNum) {
        try{
          const r = await multiSend.multiSending(
            bondAddresses,
            ethers.utils.parseEther("0.002"),
            {value: ethers.utils.parseEther(String(0.002 * bondAddresses.length + 0.00001))}
          );
          console.log(
            `address send at tx:${JSON.stringify(r)}, for: ${JSON.stringify(
              bondAddresses
            )}`
          );
        }catch(e){
          console.log(`send tx error for address:${JSON.stringify(bondAddresses)} reason: ${JSON.stringify(e)}`)
        }

        bondAddresses = [];

        await sleep(18000);
        officialUser.incrementTransactionCount();
      }
    } else {
      console.log(`${addressesArray[i]} is not a valid address`);
    }
  }

  console.log("all done");
}

function sleep(ms: number) {
  console.log(`sleeping ${ms} ms...`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { ethers, run, network } from "hardhat";

async function main() {
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();

  await simpleStorage.deployed();

  console.log(`SimpleStorage deployed to ${simpleStorage.address}`);

  if (network.config.chainId === 5 && !!process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for 6 confirmations...");
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address);
  }

  // Interacting with the contract
  const currentValue = await simpleStorage.retrieve();
  console.log("Current value: ", currentValue.toString());

  const transaction = await simpleStorage.store("42");
  await transaction.wait(1);

  const newValue = await simpleStorage.retrieve();
  console.log("New value: ", newValue.toString());
}

const verify = async (contractAddress: string, args: any[] = []) => {
  console.log("Verifying contract on Explorer...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Contract source code already verified");
    } else {
      console.error("Error verifying contract", error);
    }
  }
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
